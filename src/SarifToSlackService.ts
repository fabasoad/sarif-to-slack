import { promises as fs } from 'fs'
import { Log } from 'sarif'
import Logger from './Logger'
import { SlackMessageBuilder } from './SlackMessageBuilder'
import {
  LogOptions,
  RunMetadata,
  SarifModel,
  SarifOptions,
  SarifToSlackServiceOptions,
  SecurityLevel,
  SecuritySeverity,
  SendIf,
  SlackMessage
} from './types'
import System from './System'
import { extractListOfFiles } from './utils/FileUtils'
import { createRepresentation } from './representations/RepresentationFactory'
import { createFinding } from './model/Finding'
import { findToolComponent, findToolComponentDriver } from './utils/SarifUtils'
import { identifyColor } from './model/Color'
import FindingsArray from './model/FindingsArray'

/**
 * Service to convert SARIF files to Slack messages and send them.
 * @public
 */
export class SarifToSlackService {
  private _message?: SlackMessage
  private _sarifModel?: SarifModel
  private _sendIf?: SendIf

  private constructor(log?: LogOptions) {
    Logger.initialize(log)
    System.initialize()
  }

  public static async create(opts: SarifToSlackServiceOptions): Promise<SarifToSlackService> {
    const instance = new SarifToSlackService(opts.log)
    instance._sendIf = opts.sendIf
    instance._sarifModel = await SarifToSlackService.buildModel(opts.sarif)
    instance._message = await SarifToSlackService.initialize(instance._sarifModel, opts)
    return instance;
  }

  private static async buildModel(sarifOpts: SarifOptions): Promise<SarifModel> {
    const sarifFiles: string[] = extractListOfFiles(sarifOpts)
    if (sarifFiles.length === 0) {
      throw new Error(`No SARIF files found at the provided path: ${sarifOpts.path}`)
    }

    const model: SarifModel = { sarifFiles, runs: [], findings: new FindingsArray() }
    let runId = 1
    for (const sarifPath of sarifFiles) {
      const sarifJson: string = await fs.readFile(sarifPath, 'utf8')
      const sarifLog: Log = JSON.parse(sarifJson) as Log

      for (const run of sarifLog.runs) {
        let runMetadata: RunMetadata | undefined = undefined
        for (const result of run.results ?? []) {
          runMetadata = {
            id: runId,
            run,
            toolName: findToolComponent(run, result).name
          }
          model.findings.push(createFinding({ sarifPath, result, runMetadata }))
        }
        runMetadata ??= {
          id: runId, run, toolName: findToolComponentDriver(run).name
        }
        model.runs.push(runMetadata)
        runId++
      }
    }
    return model
  }

  /**
   * The main function to initialize a list of {@link SlackMessage} objects based
   * on the given SARIF file(s).
   * @param sarifModel An instance of {@link SarifModel} object.
   * @param opts An instance of {@link SarifToSlackServiceOptions} object.
   * @returns A map where key is the SARIF file and value is an instance of
   * {@link SlackMessage} object
   * @private
   */
  private static async initialize(
    sarifModel: SarifModel,
    opts: Omit<SarifToSlackServiceOptions, 'sarif' | 'log' | 'sendIf'>
  ): Promise<SlackMessage> {
    const message: SlackMessage = new SlackMessageBuilder(opts.webhookUrl, {
      username: opts.username,
      iconUrl: opts.iconUrl,
      color: identifyColor(sarifModel, opts.color),
      representation: createRepresentation(sarifModel, opts.representation),
    })
    if (opts.header?.include) {
      message.withHeader(opts.header?.value)
    }
    if (opts.footer?.include) {
      message.withFooter(opts.footer?.value, opts.footer?.type)
    }
    if (opts.actor?.include) {
      message.withActor(opts.actor?.value)
    }
    if (opts.run?.include) {
      message.withRun()
    }
    return message
  }

  /**
   * Sends a Slack message.
   * @returns A promise that resolves when the message has been sent.
   * @throws Error if a Slack message was not prepared for the given SARIF path.
   * @public
   */
  public async send(): Promise<void> {
    if (this._sarifModel == null) {
      throw new Error('Could not parse SARIF file(s).')
    }
    if (this.shouldSendMessage) {
      if (this._message == null) {
        throw new Error('Slack message was not prepared.')
      }
      const text: string = await this._message.send()
      Logger.info('Message sent. Status:', text)
    } else {
      Logger.info('Message was not sent based on the sendIf parameter:', this._sendIf)
    }
  }

  private get shouldSendMessage(): boolean {
    if (this._sendIf == null) {
      return true
    }

    switch (this._sendIf) {
      case SendIf.SeverityCritical:
        return this._sarifModel?.findings.findByProperty('severity', SecuritySeverity.Critical) != null
      case SendIf.SeverityHigh:
        return this._sarifModel?.findings.findByProperty('severity', SecuritySeverity.High) != null
      case SendIf.SeverityHighOrHigher:
        return this._sarifModel?.findings.hasSeverityOrHigher(SecuritySeverity.High) != null
      case SendIf.SeverityMedium:
        return this._sarifModel?.findings.findByProperty('severity', SecuritySeverity.Medium) != null
      case SendIf.SeverityMediumOrHigher:
        return this._sarifModel?.findings.hasSeverityOrHigher(SecuritySeverity.Medium) != null
      case SendIf.SeverityLow:
        return this._sarifModel?.findings.findByProperty('severity', SecuritySeverity.Low) != null
      case SendIf.SeverityLowOrHigher:
        return this._sarifModel?.findings.hasSeverityOrHigher(SecuritySeverity.Low) != null
      case SendIf.SeverityNone:
        return this._sarifModel?.findings.findByProperty('severity', SecuritySeverity.None) != null
      case SendIf.SeverityNoneOrHigher:
        return this._sarifModel?.findings.hasSeverityOrHigher(SecuritySeverity.None) != null
      case SendIf.SeverityUnknown:
        return this._sarifModel?.findings.findByProperty('severity', SecuritySeverity.Unknown) != null
      case SendIf.SeverityUnknownOrHigher:
        return this._sarifModel?.findings.hasSeverityOrHigher(SecuritySeverity.Unknown) != null
      case SendIf.LevelError:
        return this._sarifModel?.findings.findByProperty('level', SecurityLevel.Error) != null
      case SendIf.LevelWarning:
        return this._sarifModel?.findings.findByProperty('level', SecurityLevel.Warning) != null
      case SendIf.LevelWarningOrHigher:
        return this._sarifModel?.findings.hasLevelOrHigher(SecurityLevel.Warning) != null
      case SendIf.LevelNote:
        return this._sarifModel?.findings.findByProperty('level', SecurityLevel.Note) != null
      case SendIf.LevelNoteOrHigher:
        return this._sarifModel?.findings.hasLevelOrHigher(SecurityLevel.Note) != null
      case SendIf.LevelNone:
        return this._sarifModel?.findings.findByProperty('level', SecurityLevel.None) != null
      case SendIf.LevelNoneOrHigher:
        return this._sarifModel?.findings.hasLevelOrHigher(SecurityLevel.None) != null
      case SendIf.LevelUnknown:
        return this._sarifModel?.findings.findByProperty('level', SecurityLevel.Unknown) != null
      case SendIf.LevelUnknownOrHigher:
        return this._sarifModel?.findings.hasLevelOrHigher(SecurityLevel.Unknown) != null
      case SendIf.Always:
        return true
      case SendIf.Some:
        return (this._sarifModel?.findings.length ?? 0) > 0
      case SendIf.Empty:
        return (this._sarifModel?.findings.length ?? 0) === 0
      case SendIf.Never:
        return false
      default:
        throw new Error(`Unknown sendIf parameter: ${this._sendIf}`)
    }
  }
}
