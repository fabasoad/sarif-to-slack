import { SarifModel, SecuritySeverityValues } from '../types'
import TableGroupByRunRepresentation from './TableGroupByRunRepresentation'

export default class TableGroupByRunPerSeverityRepresentation extends TableGroupByRunRepresentation<'severity'> {

  public constructor(model: SarifModel) {
    super('severity', SecuritySeverityValues, model)
  }
}
