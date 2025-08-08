export type Func<T, R> = (input: T) => R

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
  withActor(actor?: string): void
  withFooter(text?: string, type?: FooterType): void
  withHeader(header?: string): void
  withRun(): void
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

export enum RepresentationType {
  CompactGroupByRunPerLevel = 0,
  CompactGroupByRunPerSeverity = 1,
  CompactGroupByToolNamePerLevel = 2,
  CompactGroupByToolNamePerSeverity = 3,
  CompactGroupBySarifPerLevel = 4,
  CompactGroupBySarifPerSeverity = 5,
  CompactTotalPerLevel = 6,
  CompactTotalPerSeverity = 7,
}

/**
 * Options for logging.
 * @public
 */
export type LogOptions = {
  level?: LogLevel,
  /**
   * More details here: https://github.com/fullstack-build/tslog?tab=readme-ov-file#pretty-templates-and-styles-color-settings
   */
  template?: string,
  colored?: boolean,
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
  log?: LogOptions,
  header?: IncludeAwareWithValueOptions,
  footer?: FooterOptions,
  actor?: IncludeAwareWithValueOptions,
  run?: IncludeAwareOptions,
  representation?: RepresentationType,
}

/**
 * Enum of security severity.
 * @internal
 */
export enum SecuritySeverity {
  Unknown = 'Unknown',
  None = 'None',
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

/**
 * Enum of security level.
 * @internal
 */
export enum SecurityLevel {
  Unknown = 'Unknown',
  None = 'None',
  Note = 'Note',
  Warning = 'Warning',
  Error = 'Error'
}
