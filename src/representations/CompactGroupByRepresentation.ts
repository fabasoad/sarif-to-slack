import Representation from './Representation'
import { Finding } from '../model/Finding'
import { findingsComparatorByKey } from '../utils/Comparators'

export enum GroupBy {
  Run = 0,
  Sarif = 1,
  ToolName = 2,
  Total = 3,
}

export default abstract class CompactGroupByRepresentation extends Representation {

  protected abstract composeGroupTitle(f: Finding, index: number): string

  protected abstract get groupBy(): GroupBy

  protected composeByProperty<K extends keyof Finding>(key: K): string {
    if ((this.groupBy == GroupBy.Total && this._model.findings.length === 0)
      || (this.groupBy == GroupBy.Sarif && this._model.sarifFiles.length === 0)
      || (this.groupBy == GroupBy.Run && this._model.runs.length === 0)) {
      return 'No vulnerabilities found'
    }
    return Object
      .entries(Object.groupBy(this._model.findings, this.composeGroupTitle.bind(this)))
      .map(([title, findings]: [string, Finding[] | undefined]) => {
        if (findings == null) {
          return undefined
        }
        findings.sort(findingsComparatorByKey(key))
        const summary: string = Object
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
      .filter((v: string | undefined): v is string => v != null)
      .join('\n\n')
  }
}
