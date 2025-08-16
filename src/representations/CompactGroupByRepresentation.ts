import Representation from './Representation'
import Finding from '../model/Finding'
import { findingsComparatorByKey } from '../utils/Comparators'
import { SecurityLevel, SecuritySeverity } from '../types';

const NO_VULNS_FOUND_TEXT = 'No vulnerabilities found'

/**
 * Base class of all compact representation types. By "compact" means that it
 * groups findings by the {@link Finding} property, such as "severity" or "level".
 * So, in fact it already prepares this in case of "severity":
 * @example
 * ```text
 * Critical: 1, High: 5, Medium: 2, Low: 20, None: 1, Unknown: 120
 * ```
 * or this in case of "level":
 * @example
 * ```text
 * Error: 6, Warning: 2, Note: 20, None: 1, Unknown: 120
 * ```
 * It is an abstract class, so the only question that derived classes should
 * "answer" is how to group finding to show the compact representation.
 * @internal
 */
export default abstract class CompactGroupByRepresentation extends Representation {

  protected abstract groupFindings(): Map<string, Finding[]>

  protected composeByProperty<K extends keyof Pick<Finding, 'level' | 'severity'>>(key: K): string {
    const grouped: Map<string, Finding[]> = this.groupFindings()
    if (grouped.size === 0) {
      return NO_VULNS_FOUND_TEXT
    }

    return Array.from(grouped)
      .map(([title, findings]: [string, Finding[]]): string => {
        findings.sort(findingsComparatorByKey(key))
        const summary: string =
          findings.length === 0
          ? NO_VULNS_FOUND_TEXT
          : this.composeCompactReport(findings, key)
        return `${title}\n${summary}`
      })
      .join('\n\n')
  }

  private composeCompactReport<K extends keyof Pick<Finding, 'level' | 'severity'>>(findings: Finding[], key: K): string {
    return Object
      .entries(Object.groupBy(findings, (f: Finding): PropertyKey => f[key] as PropertyKey))
      .map(([prop, findings2]: [string, Finding[] | undefined]): string | undefined => {
        if (findings2 == null) {
          return undefined
        }
        return `${this.bold(this.extractEnumValue(key, prop))}: ${findings2.length}`
      })
      .filter((v: string | undefined): v is string => v != null)
      .join(', ')
  }

  private extractEnumValue<K extends keyof Pick<Finding, 'level' | 'severity'>>(key: K, prop: string): string {
    switch (key) {
      case 'level': return SecurityLevel[Number(prop)]
      case 'severity': return SecuritySeverity[Number(prop)]
      default: throw new Error('Unknown property:', key)
    }
  }
}
