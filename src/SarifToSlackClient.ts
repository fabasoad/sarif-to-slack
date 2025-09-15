import { promises as fs } from 'node:fs'
import type { Log } from 'sarif'
import Logger from './Logger'
import {
  type RunData,
  type SarifModel,
  type SarifOptions,
  type SarifToSlackClientOptions,
  SecurityLevel,
  SecuritySeverity
} from './types'
import { logMetadata } from './system'
import { extractListOfFiles } from './utils/FileUtils'
import { createRepresentation } from './representations/RepresentationFactory'
import { createFinding } from './model/Finding'
import { findToolComponent, findToolComponentDriver } from './utils/SarifUtils'
import { identifyColor } from './model/color/ColorIdentification'
import FindingArray from './model/FindingArray'
import { createSlackMessage, type SlackMessage } from './model/SlackMessage'
import { SendIf, sendIfLogMessage } from './model/SendIf'

/**
 * Service to convert SARIF files to Slack messages and send them.
 * @public
 */
export class SarifToSlackClient {
  private readonly _logger = new Logger('SarifToSlackClient');
  private _message?: SlackMessage;
  private _sarifModel?: SarifModel;

  private _sendIf: SendIf = SendIf.Always;

  private constructor() {
    logMetadata();
  }

  private static *createRunIdGenerator(): Generator<number> {
    let runId: number = 1;
    while (true) {
      yield runId++;
    }
  }

  /**
   * Creates an instance of {@link SarifToSlackClient} class. It already has all
   * properties and fields initialized.
   * @param webhookUrl - Slack webhook URL.
   * @param opts - An instance of {@link SarifToSlackClientOptions} type.
   *
   * @see SarifToSlackClientOptions
   *
   * @public
   */
  public static async create(webhookUrl: string, opts: SarifToSlackClientOptions): Promise<SarifToSlackClient> {
    const instance = new SarifToSlackClient();
    instance._logger.trace(opts);
    instance._sendIf = opts.sendIf ?? instance._sendIf;
    instance._sarifModel = await SarifToSlackClient.buildModel(opts.sarif);
    instance._message = await SarifToSlackClient.initialize(webhookUrl, opts, instance._sarifModel);
    return instance;
  }

  private static async buildModel(sarifOpts: SarifOptions): Promise<SarifModel> {
    const sarifFiles: string[] = extractListOfFiles(sarifOpts)
    if (sarifFiles.length === 0) {
      throw new Error(`No SARIF files found at the provided path: ${sarifOpts.path}`)
    }

    const model: SarifModel = { sarifFiles, runs: [], findings: new FindingArray() }
    const runIdGenerator: Generator<number> = SarifToSlackClient.createRunIdGenerator()
    for (const sarifPath of sarifFiles) {
      const sarifJson: string = await fs.readFile(sarifPath, 'utf8')
      const sarifLog: Log = JSON.parse(sarifJson) as Log

      for (const run of sarifLog.runs) {
        const runId: IteratorResult<number> = runIdGenerator.next()
        let runMetadata: RunData | undefined
        for (const result of run.results ?? []) {
          runMetadata = {
            id: runId.value,
            run,
            toolName: findToolComponent(run, result).name
          }
          model.findings.push(createFinding({ sarifPath, result, runMetadata }))
        }
        runMetadata ??= {
          id: runId.value, run, toolName: findToolComponentDriver(run).name
        }
        model.runs.push(runMetadata)
      }
    }
    return model
  }

  /**
   * The main function to initialize a list of {@link SlackMessage} objects based
   * on the given SARIF file(s).
   * @param webhookUrl - Slack webhook URL.
   * @param opts - An instance of {@link SarifToSlackClientOptions} object.
   * @param sarifModel - An instance of SarifModel object.
   * @returns A map where key is the SARIF file and value is an instance of
   * {@link SlackMessage} object.
   * @internal
   */
  private static async initialize(
    webhookUrl: string,
    opts: SarifToSlackClientOptions,
    sarifModel: SarifModel,
  ): Promise<SlackMessage> {
    const message: SlackMessage = createSlackMessage(webhookUrl, {
      username: opts.username,
      iconUrl: opts.iconUrl,
      color: identifyColor(sarifModel.findings, opts.color),
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
      this._logger.info('Message sent. Status:', text)
    } else {
      this._logger.info(sendIfLogMessage(this._sendIf))
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
        return !!this._sarifModel?.findings.hasSeverityOrHigher(SecuritySeverity.High)
      case SendIf.SeverityMedium:
        return this._sarifModel?.findings.findByProperty('severity', SecuritySeverity.Medium) != null
      case SendIf.SeverityMediumOrHigher:
        return !!this._sarifModel?.findings.hasSeverityOrHigher(SecuritySeverity.Medium)
      case SendIf.SeverityLow:
        return this._sarifModel?.findings.findByProperty('severity', SecuritySeverity.Low) != null
      case SendIf.SeverityLowOrHigher:
        return !!this._sarifModel?.findings.hasSeverityOrHigher(SecuritySeverity.Low)
      case SendIf.SeverityNone:
        return this._sarifModel?.findings.findByProperty('severity', SecuritySeverity.None) != null
      case SendIf.SeverityNoneOrHigher:
        return !!this._sarifModel?.findings.hasSeverityOrHigher(SecuritySeverity.None)
      case SendIf.SeverityUnknown:
        return this._sarifModel?.findings.findByProperty('severity', SecuritySeverity.Unknown) != null
      case SendIf.SeverityUnknownOrHigher:
        return !!this._sarifModel?.findings.hasSeverityOrHigher(SecuritySeverity.Unknown)
      case SendIf.LevelError:
        return this._sarifModel?.findings.findByProperty('level', SecurityLevel.Error) != null
      case SendIf.LevelWarning:
        return this._sarifModel?.findings.findByProperty('level', SecurityLevel.Warning) != null
      case SendIf.LevelWarningOrHigher:
        return !!this._sarifModel?.findings.hasLevelOrHigher(SecurityLevel.Warning)
      case SendIf.LevelNote:
        return this._sarifModel?.findings.findByProperty('level', SecurityLevel.Note) != null
      case SendIf.LevelNoteOrHigher:
        return !!this._sarifModel?.findings.hasLevelOrHigher(SecurityLevel.Note)
      case SendIf.LevelNone:
        return this._sarifModel?.findings.findByProperty('level', SecurityLevel.None) != null
      case SendIf.LevelNoneOrHigher:
        return !!this._sarifModel?.findings.hasLevelOrHigher(SecurityLevel.None)
      case SendIf.LevelUnknown:
        return this._sarifModel?.findings.findByProperty('level', SecurityLevel.Unknown) != null
      case SendIf.LevelUnknownOrHigher:
        return !!this._sarifModel?.findings.hasLevelOrHigher(SecurityLevel.Unknown)
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
