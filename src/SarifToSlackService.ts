import { promises as fs } from 'fs';
import Logger from './Logger'
import { processColor, processLogLevel, processSarifPath } from './Processors'
import { SlackMessageBuilder } from './SlackMessageBuilder'
import {
  Sarif,
  SarifToSlackServiceOptions,
  SlackMessage
} from './types'

async function initialize(opts: SarifToSlackServiceOptions): Promise<Map<string, SlackMessage>> {
  const slackMessages = new Map<string, SlackMessage>();
  const sarifFiles: string[] = processSarifPath(opts.sarifPath)
  if (sarifFiles.length === 0) {
    throw new Error(`No SARIF files found at the provided path: ${opts.sarifPath}`)
  }

  for (const sarifFile of sarifFiles) {
    const jsonString: string = await fs.readFile(sarifFile, 'utf8')

    const messageBuilder = new SlackMessageBuilder(opts.webhookUrl, {
      username: opts.username,
      iconUrl: opts.iconUrl,
      color: processColor(opts.color),
      sarif: JSON.parse(jsonString) as Sarif
    })
    if (opts.header?.include) {
      messageBuilder.withHeader(opts.header?.value)
    }
    if (opts.footer?.include) {
      messageBuilder.withFooter(opts.footer?.value)
    }
    if (opts.actor?.include) {
      messageBuilder.withActor(opts.actor?.value)
    }
    if (opts.run?.include) {
      messageBuilder.withRun()
    }
    slackMessages.set(sarifFile, messageBuilder)
  }
  return slackMessages;
}

/**
 * Service to convert SARIF files to Slack messages and send them.
 * @public
 */
export class SarifToSlackService {
  private readonly _slackMessages: Map<string, SlackMessage>;

  private constructor() {
    this._slackMessages = new Map<string, SlackMessage>();
  }

  /**
   * Gets the Slack messages prepared for each SARIF file.
   * @returns A read-only map where keys are SARIF file paths and values are SlackMessage instances.
   * @public
   */
  public get slackMessages(): ReadonlyMap<string, SlackMessage> {
    return this._slackMessages;
  }

  /**
   * Creates an instance of SarifToSlackService.
   * @param opts - Options for the service, including webhook URL, SARIF path, and other configurations.
   * @returns A promise that resolves to an instance of SarifToSlackService.
   * @throws Error if no SARIF files are found at the provided path.
   * @public
   */
  public static async create(opts: SarifToSlackServiceOptions): Promise<SarifToSlackService> {
    Logger.initialize({
      logLevel: processLogLevel(opts.logLevel)
    })
    const instance: SarifToSlackService = new SarifToSlackService()
    const map: Map<string, SlackMessage> = await initialize(opts)
    map.forEach((val: SlackMessage, key: string) => instance._slackMessages.set(key, val))
    return instance
  }

  /**
   * Sends all prepared Slack messages.
   * @returns A promise that resolves when all messages have been sent.
   * @throws Error if a Slack message was not prepared for a SARIF path.
   * @public
   */
  public async sendAll(): Promise<void> {
    for (const sarifPath of this._slackMessages.keys()) {
      await this.send(sarifPath);
    }
  }

  /**
   * Sends a Slack message for a specific SARIF path.
   * @param sarifPath - The path of the SARIF file for which the message should be sent.
   * @returns A promise that resolves when the message has been sent.
   * @throws Error if a Slack message was not prepared for the given SARIF path.
   * @public
   */
  public async send(sarifPath: string): Promise<void> {
    const message: SlackMessage | undefined = this._slackMessages.get(sarifPath)
    if (!message) {
      throw new Error(`Slack message was not prepared for SARIF path: ${sarifPath}.`)
    }
    const text: string = await message.send()
    Logger.info(`Message sent for ${sarifPath} file. Status:`, text)
  }
}
