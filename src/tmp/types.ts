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
 * Ordering of security severity values. It is used for sorting purposes, so that
 * Slack message shows issues in the correct order.
 * @internal
 */
export const SecuritySeverityOrder: SecuritySeverity[] = [
  SecuritySeverity.Critical,
  SecuritySeverity.High,
  SecuritySeverity.Medium,
  SecuritySeverity.Low,
  SecuritySeverity.None,
  SecuritySeverity.Unknown
]

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


/**
 * Ordering of security level values. It is used for sorting purposes, so that
 * Slack message shows issues in the correct order.
 * @internal
 */
export const SecurityLevelOrder: SecurityLevel[] = [
  SecurityLevel.Error,
  SecurityLevel.Warning,
  SecurityLevel.Note,
  SecurityLevel.Unknown
]
