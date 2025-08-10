import Representation from './Representation'
import { Finding } from '../model/Finding'
import { findingsComparatorByKey } from '../utils/Comparators'

const NO_VULNS_FOUND_TEXT = 'No vulnerabilities found'

export default abstract class CompactGroupByRepresentation extends Representation {

  protected abstract groupFindings(): Map<string, Finding[]>

  protected composeByProperty<K extends keyof Pick<Finding, 'level' | 'severity'>>(key: K): string {
    const grouped: Map<string, Finding[]> = this.groupFindings()
    if (grouped.size === 0) {
      return NO_VULNS_FOUND_TEXT
    }

    return Array.from(grouped)
      .map(([title, findings]: [string, Finding[]]) => {
        findings.sort(findingsComparatorByKey(key))
        const summary: string =
          findings.length === 0
          ? NO_VULNS_FOUND_TEXT
          : Object
            .entries(Object.groupBy(findings, (f: Finding): PropertyKey => f[key] as PropertyKey))
            .map(([key, findings2]: [string, Finding[] | undefined]): string | undefined => {
              if (findings2 == null) {
                return undefined
              }
              return `${this.bold(key)}: ${findings2.length}`
            })
            .filter((v: string | undefined): v is string => v != null)
            .join(', ')
        return `${title}\n${summary}`
      })
      .join('\n\n')
  }
}
