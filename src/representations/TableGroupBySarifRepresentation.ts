import { SarifModel } from '../types'
import Finding from '../model/Finding'
import TableGroupRepresentation from './TableGroupRepresentation'

export default abstract class TableGroupBySarifRepresentation<
  KPer extends keyof Pick<Finding, 'level' | 'severity'>
> extends TableGroupRepresentation<'sarifPath', KPer> {
  private readonly _fileToNumberMap = new Map<string, number>()

  protected constructor(
    keyPer: KPer,
    values: string[],
    model: SarifModel
  ) {
    super('sarifPath', keyPer, values, model)
  }

  protected override keyByToString(key: Finding['sarifPath']): string {
    const keyStr: string = key.toString()
    if (!this._fileToNumberMap.has(keyStr)) {
      this._fileToNumberMap.set(keyStr, this._fileToNumberMap.size + 1)
    }
    return this._fileToNumberMap.get(keyStr)?.toString() as string
  }
}
