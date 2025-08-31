import { SarifModel, SecurityLevelValues } from '../types'
import TableGroupByToolNameRepresentation
  from './TableGroupByToolNameRepresentation'

export default class TableGroupByToolNamePerLevelRepresentation extends TableGroupByToolNameRepresentation<'level'> {

  public constructor(model: SarifModel) {
    super('level', SecurityLevelValues, model)
  }
}
