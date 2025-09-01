import { SarifModel } from '../types'
import Finding from '../model/Finding'
import TableGroupRepresentation from './TableGroupRepresentation'

export default abstract class TableGroupByRunRepresentation<
  KPer extends keyof Pick<Finding, 'level' | 'severity'>
> extends TableGroupRepresentation<'runId', KPer> {
  protected constructor(
    keyPer: KPer,
    values: string[],
    model: SarifModel
  ) {
    super('runId', keyPer, values, model)
  }
}
