import { SarifModel } from '../types'
import Finding from '../model/Finding'
import Representation from './Representation'
import Table from './table/Table'
import Logger from '../Logger'

export default abstract class TableGroupByToolNameRepresentation<K extends keyof Pick<Finding, 'level' | 'severity'>> extends Representation {
  protected constructor(
    private readonly _key: K,
    private readonly _values: string[],
    model: SarifModel
  ) {
    super(model, 'toolName')
  }

  private groupFindings(findings: Finding[]): Finding[][] {
    return findings.reduce(
      (grouped: Finding[][], f: Finding): Finding[][] => {
        grouped[f[this._key]].push(f)
        return grouped
      },
      Array.from({ length: this._values.length }, (): Finding[] => new Array<Finding>())
    )
  }

  private groupFindingsByToolName(findings: Finding[]): Map<string, Finding[]> {
    return findings.reduce(
      (grouped: Map<string, Finding[]>, f: Finding): Map<string, Finding[]> => {
        if (!grouped.has(f.toolName)) {
          grouped.set(f.toolName, [])
        }
        grouped.get(f.toolName)?.push(f)
        return grouped
      },
      new Map<string, Finding[]>()
    )
  }

  public override compose(): string {
    const groupedByToolName: Map<string, Finding[]> = this.groupFindingsByToolName(this._model.findings)
    const table = new Table({
      rows: Array.from(groupedByToolName.keys()),
      columns: this._values,
    })
    let i = 0
    for (const findings of groupedByToolName.values()) {
      const grouped: Finding[][] = this.groupFindings(findings)
      for (let j = 0; j < grouped.length; j++) {
        table.set(i, j, grouped[j].length)
      }
      i++
    }
    const result = this.codeBlock(table.toString())
    Logger.trace(result)
    return result
  }
}
