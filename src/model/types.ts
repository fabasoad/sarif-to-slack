export enum SecuritySeverity {
  Unknown = 'Unknown',
  None = 'None',
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export const SecuritySeverityOrder: SecuritySeverity[] = [
  SecuritySeverity.Critical,
  SecuritySeverity.High,
  SecuritySeverity.Medium,
  SecuritySeverity.Low,
  SecuritySeverity.None,
  SecuritySeverity.Unknown
]

export enum SecurityLevel {
  Unknown = 'Unknown',
  Note = 'Note',
  Warning = 'Warning',
  Error = 'Error'
}

export const SecurityLevelOrder: SecurityLevel[] = [
  SecurityLevel.Error,
  SecurityLevel.Warning,
  SecurityLevel.Note,
  SecurityLevel.Unknown
]
