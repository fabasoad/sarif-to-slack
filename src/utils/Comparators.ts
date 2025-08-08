import { Finding } from '../model/Finding'
import { SecurityLevel, SecuritySeverity } from '../types'

/**
 * Ordering of security severity values. It is used for sorting purposes, so that
 * Slack message shows issues in the correct order.
 * @private
 */
const SecuritySeverityOrder: SecuritySeverity[] = [
  SecuritySeverity.Critical,
  SecuritySeverity.High,
  SecuritySeverity.Medium,
  SecuritySeverity.Low,
  SecuritySeverity.None,
  SecuritySeverity.Unknown
]

/**
 * Ordering of security level values. It is used for sorting purposes, so that
 * Slack message shows issues in the correct order.
 * @private
 */
const SecurityLevelOrder: SecurityLevel[] = [
  SecurityLevel.Error,
  SecurityLevel.Warning,
  SecurityLevel.Note,
  SecurityLevel.Unknown
]

export type FindingComparator = (a: Finding, b: Finding) => number

export function findingsComparatorByKey<K extends keyof Finding>(key: K): FindingComparator {
  return (a: Finding, b: Finding): number => {
    switch (key) {
      case 'severity': return SecuritySeverityOrder.indexOf(a.severity) - SecuritySeverityOrder.indexOf(b.severity)
      case 'level': return SecurityLevelOrder.indexOf(a.level) - SecurityLevelOrder.indexOf(b.level)
      case 'runId': return a.runId - b.runId
      case 'toolName': return a.toolName.toLowerCase().localeCompare(b.toolName.toLowerCase())
      default: return 1
    }
  }
}
