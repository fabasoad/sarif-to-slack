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
   * Represents the most verbose logging level, typically used for detailed
   * debugging information.
   */
  Silly = 0,
  /**
   * Represents a logging level for tracing the flow of the application.
   */
  Trace = 1,
  /**
   * Represents a logging level for debugging information that is less verbose
   * than silly.
   */
  Debug = 2,
  /**
   * Represents a logging level for general informational messages that highlight
   * the progress of the application.
   */
  Info = 3,
  /**
   * Represents a logging level for potentially harmful situations that require
   * attention.
   */
  Warning = 4,
  /**
   * Represents a logging level for error conditions that do not require immediate
   * action but should be noted.
   */
  Error = 5,
  /**
   * Represents a logging level for critical errors that require immediate attention
   * and may cause the application to terminate.
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
  /**
   * Represents a plain text footer. Text is not formatted and appears as-is.
   */
  PlainText = 'plain_text',
  /**
   * Represents a footer with Markdown formatting. Text can include formatting
   * such as bold, italics, and links.
   */
  Markdown = 'mrkdwn'
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
  /**
   * Groups results by the tool name. Particularly, groups by the runs[].tool.driver.name
   * property from the SARIF file(s).
   */
  ToolName = 0,
  /**
   * Groups results by the run. It provides the result from each run individually.
   */
  Run = 1,
  /**
   * Does not group results. It provides the result from all the runs from all
   * the provided SARIF files.
   */
  Total = 2,
}

/**
 * Enum representing how to calculate results.
 * @public
 */
export enum CalculateResultsBy {
  /**
   * Calculates results by the security level of the findings: Error, Warning,
   * Note and Unknown. At first, it tries to get the security level from runs[].results[].level
   * property. If it is not defined, it tries to get the security level from the
   * respective rule of each result, using the rules[].properties['problem.severity']
   * property.
   */
  Level = 0,
  /**
   * Calculates results by the security severity of the findings: Critical, High,
   * Medium, Low, None and Unknown. it tries to get the security severity from the
   * respective rule of each result, using the rules[].properties['security-severity']
   * property. This property contains CVSS score, which is then mapped to the
   * security severity value.
   */
  Severity = 1,
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
