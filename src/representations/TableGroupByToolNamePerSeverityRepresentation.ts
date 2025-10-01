import { type SarifModel, SecuritySeverityValues } from '../types'
import TableGroupByToolNameRepresentation
  from './TableGroupByToolNameRepresentation'

export default class TableGroupByToolNamePerSeverityRepresentation extends TableGroupByToolNameRepresentation<'severity'> {

  public constructor(model: SarifModel) {
    super('severity', SecuritySeverityValues, model)
  }
}
