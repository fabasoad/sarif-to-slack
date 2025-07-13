export enum SecuritySeverity {
  UNKNOWN = 'Unknown',
  NONE = 'None',
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export const SecuritySeverityOrder: SecuritySeverity[] = [
  SecuritySeverity.CRITICAL,
  SecuritySeverity.HIGH,
  SecuritySeverity.MEDIUM,
  SecuritySeverity.LOW,
  SecuritySeverity.NONE,
  SecuritySeverity.UNKNOWN
]

export enum SecurityLevel {
  UNKNOWN = 'Unknown',
  NOTE = 'Note',
  WARNING = 'Warning',
  ERROR = 'Error'
}

export const SecurityLevelOrder: SecurityLevel[] = [
  SecurityLevel.ERROR,
  SecurityLevel.WARNING,
  SecurityLevel.NOTE,
  SecurityLevel.UNKNOWN
]
