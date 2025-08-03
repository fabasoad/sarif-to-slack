import Representation from './Representation'
import { Finding } from '../model/Finding'
import { findingsComparatorByKey } from '../types'

export default abstract class CompactGroupByRepresentation extends Representation {

  protected constructor(findings: Finding[], key: keyof Finding) {
    super(
      findings
        .map((f: Finding): Finding => f.clone())
        .sort(findingsComparatorByKey(key))
    )
  }

  protected abstract composeGroupTitle(f: Finding): string

  protected composeByProperty<K extends keyof Finding>(key: K): string {
    return Object
      .entries(Object.groupBy(this._findings, (f: Finding): string => this.composeGroupTitle(f)))
      .map(([title, findings]: [string, Finding[] | undefined]) => {
        if (findings == null) {
          return undefined
        }
        findings.sort(findingsComparatorByKey(key))
        const msgPerToolName: string = Object
          .entries(Object.groupBy(findings, (f: Finding): PropertyKey => f[key] as PropertyKey))
          .map(([key, findings2]: [string, Finding[] | undefined]): string | undefined => {
            if (findings2 == null) {
              return undefined
            }
            return `${this.bold(key)}: ${findings2.length}`
          })
          .filter((v: string | undefined): v is string => v != null)
          .join(',')
        return `${title}\n${msgPerToolName}`
      })
      .filter((v: string | undefined): v is string => v != null)
      .join('\n')
  }
}
