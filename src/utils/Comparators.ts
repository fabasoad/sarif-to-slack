import { Finding } from '../model/Finding'

/**
 * This function returns a comparator function based on the property of the
 * {@link Finding} object.
 * @param key Property name of the {@link Finding} object.
 * @internal
 */
export function findingsComparatorByKey<K extends keyof Finding>(key: K): (a: Finding, b: Finding) => number {
  return (a: Finding, b: Finding): number => {
    switch (key) {
      case 'severity': return b.severity - a.severity
      case 'level': return b.level - a.level
      case 'runId': return a.runId - b.runId
      case 'toolName': return a.toolName.toLowerCase().localeCompare(b.toolName.toLowerCase())
      default: return 1
    }
  }
}
