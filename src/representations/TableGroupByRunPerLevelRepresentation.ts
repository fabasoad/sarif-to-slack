import { type SarifModel, SecurityLevelValues } from '../types'
import TableGroupByRunRepresentation from './TableGroupByRunRepresentation'

export default class TableGroupByRunPerLevelRepresentation extends TableGroupByRunRepresentation<'level'> {

  public constructor(model: SarifModel) {
    super('level', SecurityLevelValues, model)
  }
}
