import type { SarifModel } from '../types'
import type Finding from '../model/Finding'
import TableGroupRepresentation from './TableGroupRepresentation';

export default abstract class TableGroupByToolNameRepresentation<
  KPer extends keyof Pick<Finding, 'level' | 'severity'>
> extends TableGroupRepresentation<'toolName', KPer> {
  protected constructor(
    keyPer: KPer,
    values: string[],
    model: SarifModel
  ) {
    super('toolName', keyPer, values, model)
  }
}
