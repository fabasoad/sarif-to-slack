import { type SarifModel, SecuritySeverityValues } from '../types'
import TableGroupBySarifRepresentation from './TableGroupBySarifRepresentation'

export default class TableGroupBySarifPerSeverityRepresentation extends TableGroupBySarifRepresentation<'severity'> {

  public constructor(model: SarifModel) {
    super('severity', SecuritySeverityValues, model)
  }
}
