import { SarifModel, SecurityLevelValues } from '../types'
import TableGroupBySarifRepresentation from './TableGroupBySarifRepresentation'

export default class TableGroupBySarifPerLevelRepresentation extends TableGroupBySarifRepresentation<'level'> {

  public constructor(model: SarifModel) {
    super('level', SecurityLevelValues, model)
  }
}
