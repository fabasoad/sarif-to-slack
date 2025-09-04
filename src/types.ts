import { Run } from 'sarif'
import { ColorOptions } from './model/color/ColorOptions'
import FindingArray from './model/FindingArray'
import { SendIf } from './model/SendIf'

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
 * This represents what type of message should be sent. There are various options
 * to show information from SARIF in Slack message.
 * @public
 */
export enum RepresentationType {
  /**
   * Compact information about findings grouped by Run with the level representation.
   * @example
   * ```text
   * [Run 1] Grype
   * Error: 1, Warning: 4
   * [Run 2] Grype
   * Warning: 1, Note: 20
   * ```
   */
  CompactGroupByRunPerLevel = 0,
  /**
   * Compact information about findings grouped by Run with the severity representation.
   * @example
   * ```text
   * [Run 1] Grype
   * Critical: 1, High: 3, Medium: 1
   * [Run 2] Grype
   * Medium: 1, Low: 20
   * ```
   */
  CompactGroupByRunPerSeverity = 1,
  /**
   * Compact information about findings grouped by tool name with the level representation.
   * @example
   * ```text
   * Grype
   * Error: 1, Warning: 5, Note: 20
   * ```
   */
  CompactGroupByToolNamePerLevel = 2,
  /**
   * Compact information about findings grouped by tool name with the severity representation.
   * @example
   * ```text
   * Grype
   * Critical: 1, High: 3, Medium: 2, Low: 20
   * ```
   */
  CompactGroupByToolNamePerSeverity = 3,
  /**
   * Compact information about findings grouped by SARIF file with the level representation.
   * @example
   * ```text
   * grype-results-01.sarif
   * Error: 1, Warning: 2, Note: 1
   * grype-results-02.sarif
   * Warning: 3, Note: 19
   * ```
   */
  CompactGroupBySarifPerLevel = 4,
  /**
   * Compact information about findings grouped by SARIF file with the severity
   * representation.
   * @example
   * ```text
   * grype-results-01.sarif
   * High: 3, Medium: 1, Low: 11
   * grype-results-02.sarif
   * Critical: 1, Medium: 1, Low: 9
   * ```
   */
  CompactGroupBySarifPerSeverity = 5,
  /**
   * Compact information about findings with the level representation.
   * @example
   * ```text
   * Total
   * Error: 1, Warning: 5, Note: 20
   * ```
   */
  CompactTotalPerLevel = 6,
  /**
   * Compact information about findings with the severity representation.
   * @example
   * ```text
   * Total
   * Critical: 1, High: 3, Medium: 2, Low: 20
   * ```
   */
  CompactTotalPerSeverity = 7,
  /**
   * Table information about findings grouped by Run with the level representation.
   * @example
   * ```text
   * |       | Unknown | None | Note | Warning | Error | Total |
   * | ----- | ------- | ---- | ---- | ------- | ----- | ----- |
   * | 1     | 0       | 0    | 0    | 1       | 0     | 1     |
   * | 2     | 0       | 0    | 9    | 20      | 10    | 39    |
   * | 3     | 0       | 0    | 1    | 0       | 1     | 2     |
   * | 4     | 0       | 0    | 5    | 5       | 0     | 10    |
   * | ----- | ------- | ---- | ---- | ------- | ----- | ----- |
   * | Total | 0       | 0    | 15   | 26      | 11    | 52    |
   * ```
   */
  TableGroupByRunPerLevel = 8,
  /**
   * Table information about findings grouped by Run with the severity representation.
   * @example
   * ```text
   * |       | Unknown | None | Low | Medium | High | Critical | Total |
   * | ----- | ------- | ---- | --- | ------ | ---- | -------- | ----- |
   * | 1     | 0       | 0    | 0   | 1      | 0    | 0        | 1     |
   * | 2     | 0       | 0    | 9   | 20     | 10   | 0        | 39    |
   * | 3     | 0       | 0    | 1   | 0      | 1    | 0        | 2     |
   * | 4     | 0       | 0    | 5   | 5      | 0    | 0        | 10    |
   * | ----- | ------- | ---- | --- | ------ | ---- | -------- | ----- |
   * | Total | 0       | 0    | 15  | 26     | 11   | 0        | 52    |
   * ```
   */
  TableGroupByRunPerSeverity = 9,
  /**
   * Table information about findings grouped by tool name with the level representation.
   * @example
   * ```text
   * |        | Unknown | None | Note | Warning | Error | Total |
   * | ------ | ------- | ---- | ---- | ------- | ----- | ----- |
   * | CodeQL | 0       | 0    | 0    | 1       | 0     | 1     |
   * | grype  | 0       | 0    | 9    | 20      | 10    | 39    |
   * | Trivy  | 0       | 0    | 1    | 0       | 1     | 2     |
   * | WizCLI | 0       | 0    | 5    | 5       | 0     | 10    |
   * | ------ | ------- | ---- | ---- | ------- | ----- | ----- |
   * | Total  | 0       | 0    | 15   | 26      | 11    | 52    |
   * ```
   */
  TableGroupByToolNamePerLevel = 10,
  /**
   * Table information about findings grouped by tool name with the severity representation.
   * @example
   * ```text
   * |        | Unknown | None | Low | Medium | High | Critical | Total |
   * | ------ | ------- | ---- | --- | ------ | ---- | -------- | ----- |
   * | CodeQL | 0       | 0    | 0   | 1      | 0    | 0        | 1     |
   * | grype  | 0       | 0    | 9   | 20     | 10   | 0        | 39    |
   * | Trivy  | 0       | 0    | 1   | 0      | 1    | 0        | 2     |
   * | WizCLI | 0       | 0    | 5   | 5      | 0    | 0        | 10    |
   * | ------ | ------- | ---- | --- | ------ | ---- | -------- | ----- |
   * | Total  | 0       | 0    | 15  | 26     | 11   | 0        | 52    |
   * ```
   */
  TableGroupByToolNamePerSeverity = 11,
  /**
   * Table information about findings grouped by SARIF file with the level representation.
   * @example
   * ```text
   * |       | Unknown | None | Note | Warning | Error | Total |
   * | ----- | ------- | ---- | ---- | ------- | ----- | ----- |
   * | 1     | 0       | 0    | 0    | 1       | 0     | 1     |
   * | 2     | 0       | 0    | 9    | 20      | 10    | 39    |
   * | ----- | ------- | ---- | ---- | ------- | ----- | ----- |
   * | Total | 0       | 0    | 9    | 21      | 10    | 40    |
   * ```
   */
  TableGroupBySarifPerLevel = 12,
  /**
   * Table information about findings grouped by SARIF file with the severity representation.
   * @example
   * ```text
   * |       | Unknown | None | Low | Medium | High | Critical | Total |
   * | ----- | ------- | ---- | --- | ------ | ---- | -------- | ----- |
   * | 1     | 0       | 0    | 0   | 1      | 0    | 0        | 1     |
   * | 2     | 0       | 0    | 9   | 20     | 10   | 0        | 39    |
   * | ----- | ------- | ---- | --- | ------ | ---- | -------- | ----- |
   * | Total | 0       | 0    | 9   | 21     | 10   | 0        | 40    |
   * ```
   */
  TableGroupBySarifPerSeverity = 13,
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
 * SARIF file extension.
 * @public
 */
export type SarifFileExtension = 'sarif' | 'json'

/**
 * Represents options for the provided SARIF file(s), such as path, should files
 * from this path be retrieved recursively or not, and file extension.
 * @public
 */
export type SarifOptions = {
  path: string,
  recursive?: boolean,
  extension?: SarifFileExtension,
}

/**
 * Options for the SarifToSlackClient.
 * @public
 */
export type SarifToSlackClientOptions = {
  webhookUrl: string,
  sarif: SarifOptions,
  username?: string,
  iconUrl?: string,
  color?: ColorOptions,
  log?: LogOptions,
  header?: IncludeAwareWithValueOptions,
  footer?: FooterOptions,
  actor?: IncludeAwareWithValueOptions,
  run?: IncludeAwareOptions,
  representation?: RepresentationType,
  sendIf?: SendIf,
}

/**
 * Enum of security severity.
 * @privateRemarks Order should remain unchanged. It is used in multiple places,
 * such as sorting in Slack message (more important come first) and to identify
 * provided severity if it is requested severity or higher.
 * @internal
 */
export enum SecuritySeverity {
  Unknown = 0,
  None = 1,
  Low = 2,
  Medium = 3,
  High = 4,
  Critical = 5,
}

export const SecuritySeverityValues: string[] =
  Object.values(SecuritySeverity).filter(
    (v: string | SecuritySeverity): v is string => typeof v === 'string'
  )

/**
 * Enum of security level.
 * @privateRemarks Order should remain unchanged. It is used in multiple places,
 * such as sorting in Slack message (more important come first) and to identify
 * provided level if it is requested level or higher.
 * @internal
 */
export enum SecurityLevel {
  Unknown = 0,
  None = 1,
  Note = 2,
  Warning = 3,
  Error = 4,
}

export const SecurityLevelValues: string[] =
  Object.values(SecurityLevel).filter(
    (v: string | SecurityLevel): v is string => typeof v === 'string'
  )

/**
 * The data about run, such as {@link Run} itself, tool name of the run and ID
 * which is manually generated and unique within a single execution.
 * @internal
 */
export type RunData = {
  id: number,
  run: Run,
  toolName: string,
}

/**
 * Model that is used by {@link Representation}
 * @internal
 */
export type SarifModel = {
  sarifFiles: string[],
  runs: RunData[],
  findings: FindingArray,
}
