import type { SarifModel } from '../types'
import type Finding from '../model/Finding'
import Representation from './Representation'
import Table from './table/Table'
import Logger from '../Logger'

export default abstract class TableGroupRepresentation<
  KBy extends keyof Pick<Finding, 'toolName' | 'runId' | 'sarifPath'>,
  KPer extends keyof Pick<Finding, 'level' | 'severity'>
> extends Representation {
  private readonly _logger = new Logger('TableGroupRepresentation');

  protected constructor(
    private readonly _keyBy: KBy,
    private readonly _keyPer: KPer,
    private readonly _values: string[],
    model: SarifModel
  ) {
    super(model, 'toolName')
  }

  private groupFindingsPer(findings: Finding[]): Finding[][] {
    return findings.reduce(
      (grouped: Finding[][], f: Finding): Finding[][] => {
        grouped[f[this._keyPer]].push(f)
        return grouped
      },
      Array.from({ length: this._values.length }, (): Finding[] => [] as Finding[])
    )
  }

  protected keyByToString(key: Finding[KBy]): string {
    return key.toString()
  }

  private groupFindingsBy(findings: Finding[]): Map<string, Finding[]> {
    return findings.reduce(
      (grouped: Map<string, Finding[]>, f: Finding): Map<string, Finding[]> => {
        const key: string = this.keyByToString(f[this._keyBy])
        if (!grouped.has(key)) {
          grouped.set(key, [])
        }
        grouped.get(key)?.push(f)
        return grouped
      },
      new Map<string, Finding[]>()
    )
  }

  private get title(): string {
    switch (this._keyBy) {
      case 'toolName': return 'Tool'
      case 'runId': return 'Run #'
      case 'sarifPath': return 'File #'
      default: return ''
    }
  }

  public override compose(): string {
    const groupedBy: Map<string, Finding[]> = this.groupFindingsBy(this._model.findings)
    const table = new Table({
      main: this.title,
      rows: Array.from(groupedBy.keys()),
      columns: this._values,
    })
    let i = 0
    for (const findings of groupedBy.values()) {
      const grouped: Finding[][] = this.groupFindingsPer(findings)
      for (let j = 0; j < grouped.length; j++) {
        table.set(i, j, grouped[j].length)
      }
      i++
    }
    const result: string = this.codeBlock(table.toString())
    this._logger.trace(result)
    return result
  }
}
