import type { Log } from 'sarif'

/**
 * Type representing a SARIF log.
 * @public
 */
export type Sarif = Log

/**
 * Interface for a Slack message that can be sent.
 * @public
 */
export interface SlackMessage {
  /**
   * Sends the Slack message.
   * @returns A promise that resolves to the response from the Slack webhook.
   */
  send: () => Promise<string>
  /**
   * The SARIF log associated with this Slack message.
   */
  sarif: Sarif
}

/**
 * Enum representing log levels for the service.
 * @public
 */
export enum LogLevel {
  /**
   * Represents the most verbose logging level, typically used for detailed debugging information.
   */
  Silly = 0,
  /**
   * Represents a logging level for tracing the flow of the application.
   */
  Trace = 1,
  /**
   * Represents a logging level for debugging information that is less verbose than silly.
   */
  Debug = 2,
  /**
   * Represents a logging level for general informational messages that highlight the progress of the application.
   */
  Info = 3,
  /**
   * Represents a logging level for potentially harmful situations that require attention.
   */
  Warning = 4,
  /**
   * Represents a logging level for error conditions that do not require immediate action but should be noted.
   */
  Error = 5,
  /**
   * Represents a logging level for critical errors that require immediate attention and may cause the application to terminate.
   */
  Fatal = 6
}

/**
 * Type representing properties that indicate whether to include certain information
 * in the Slack message.
 * @public
 */
export type IncludeAwareOptions = {
  include: boolean
}

/**
 * Type representing properties that indicate whether to include certain information
 * in the Slack message, along with an optional value.
 * @public
 */
export type IncludeAwareWithValueOptions = IncludeAwareOptions & {
  value?: string
}

/**
 * Enum representing the type of footer in a Slack message.
 * @public
 */
export enum FooterType {
  PLAIN_TEXT = 'plain_text',
  MARKDOWN = 'mrkdwn'
}

/**
 * Options for the footer of a Slack message. "type" is ignored if "value" is
 * not defined.
 * @public
 */
export type FooterOptions = IncludeAwareWithValueOptions & {
  type?: FooterType
}

/**
 * Enum representing how to group results.
 * @public
 */
export enum GroupResultsBy {
  TOOL_NAME = 0,
  TOTAL = 1,
}

/**
 * Enum representing how to calculate results.
 * @public
 */
export enum CalculateResultsBy {
  LEVEL = 0,
  SEVERITY = 1,
}

/**
 * Options for how to output the results in the Slack message.
 * @public
 */
export type SarifToSlackOutput = {
  groupBy: GroupResultsBy,
  calculateBy: CalculateResultsBy,
}

/**
 * Options for the SarifToSlackService.
 * @public
 */
export type SarifToSlackServiceOptions = {
  // The Slack webhook URL to send messages to.
  webhookUrl: string,
  sarifPath: string,
  username?: string,
  iconUrl?: string,
  color?: string,
  logLevel?: LogLevel | string,
  header?: IncludeAwareWithValueOptions,
  footer?: FooterOptions,
  actor?: IncludeAwareWithValueOptions,
  run?: IncludeAwareOptions,
  output?: SarifToSlackOutput,
}
