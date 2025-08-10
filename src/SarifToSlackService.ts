import { promises as fs } from 'fs'
import Logger from './Logger'
import { SlackMessageBuilder } from './SlackMessageBuilder'
import {
  LogOptions, RunMetadata, SarifModel,
  SarifToSlackServiceOptions,
  SlackMessage
} from './types'
import System from './System'
import { extractListOfFiles } from './utils/FileUtils'
import { createRepresentation } from './representations/RepresentationFactory'
import { createFinding } from './model/Finding'
import { Log } from 'sarif'
import { mapColor } from './mappers/ColorMapper'

/**
 * Service to convert SARIF files to Slack messages and send them.
 * @public
 */
export class SarifToSlackService {
  private _message?: SlackMessage

  private constructor(log?: LogOptions) {
    Logger.initialize(log)
    System.initialize()
  }

  public static async create(opts: SarifToSlackServiceOptions): Promise<SarifToSlackService> {
    const instance = new SarifToSlackService(opts.log)
    instance._message = await SarifToSlackService.initialize(opts)
    return instance;
  }

  private static async buildModel(sarifPath: string): Promise<SarifModel> {
    const sarifFiles: string[] = extractListOfFiles(sarifPath)
    if (sarifFiles.length === 0) {
      throw new Error(`No SARIF files found at the provided path: ${sarifPath}`)
    }

    const model: SarifModel = { sarifFiles, runs: [], findings: [] }
    let runId = 1
    for (const sarifPath of sarifFiles) {
      const sarifJson: string = await fs.readFile(sarifPath, 'utf8')
      const sarifLog: Log = JSON.parse(sarifJson) as Log

      for (const run of sarifLog.runs) {
        const runMetadata: RunMetadata = { id: runId++, run }
        model.runs.push(runMetadata)
        for (const result of run.results ?? []) {
          model.findings.push(createFinding({ sarifPath, result, runMetadata }))
        }
      }
    }
    return model
  }

  /**
   * The main function to initialize a list of {@link SlackMessage} objects based
   * on the given SARIF file(s).
   * @param opts An instance of {@link SarifToSlackServiceOptions} object.
   * @returns A map where key is the SARIF file and value is an instance of
   * {@link SlackMessage} object
   * @private
   */
  private static async initialize(opts: SarifToSlackServiceOptions): Promise<SlackMessage> {
    const model: SarifModel = await SarifToSlackService.buildModel(opts.sarifPath)
    const message: SlackMessage = new SlackMessageBuilder(opts.webhookUrl, {
      username: opts.username,
      iconUrl: opts.iconUrl,
      color: mapColor(opts.color),
      representation: createRepresentation(model, opts.representation),
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
    if (!this._message) {
      throw new Error('Slack message was not prepared.')
    }
    const text: string = await this._message.send()
    Logger.info(`Message sent. Status:`, text)
  }
}
