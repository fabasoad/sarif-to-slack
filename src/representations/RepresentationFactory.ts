import Representation from './Representation'
import { RepresentationType, SarifModel } from '../types'
import CompactGroupByRunPerLevelRepresentation
  from './CompactGroupByRunPerLevelRepresentation'
import CompactGroupByRunPerSeverityRepresentation
  from './CompactGroupByRunPerSeverityRepresentation'
import CompactGroupByToolNamePerLevelRepresentation
  from './CompactGroupByToolNamePerLevelRepresentation'
import CompactGroupByToolNamePerSeverityRepresentation
  from './CompactGroupByToolNamePerSeverityRepresentation'
import {
  CompactGroupBySarifPerLevelRepresentation
} from './CompactGroupBySarifPerLevelRepresentation'
import {
  CompactGroupBySarifPerSeverityRepresentation
} from './CompactGroupBySarifPerSeverityRepresentation'
import {
  CompactTotalPerSeverityRepresentation
} from './CompactTotalPerSeverityRepresentation'
import {
  CompactTotalPerLevelRepresentation
} from './CompactTotalPerLevelRepresentation'

export function createRepresentation(
  model: SarifModel,
  type: RepresentationType = RepresentationType.CompactGroupByToolNamePerSeverity
): Representation {
  switch (type) {
    case RepresentationType.CompactGroupByRunPerLevel:
      return new CompactGroupByRunPerLevelRepresentation(model)
    case RepresentationType.CompactGroupByRunPerSeverity:
      return new CompactGroupByRunPerSeverityRepresentation(model)
    case RepresentationType.CompactGroupByToolNamePerLevel:
      return new CompactGroupByToolNamePerLevelRepresentation(model)
    case RepresentationType.CompactGroupByToolNamePerSeverity:
      return new CompactGroupByToolNamePerSeverityRepresentation(model)
    case RepresentationType.CompactGroupBySarifPerLevel:
      return new CompactGroupBySarifPerLevelRepresentation(model)
    case RepresentationType.CompactGroupBySarifPerSeverity:
      return new CompactGroupBySarifPerSeverityRepresentation(model)
    case RepresentationType.CompactTotalPerLevel:
      return new CompactTotalPerLevelRepresentation(model)
    case RepresentationType.CompactTotalPerSeverity:
      return new CompactTotalPerSeverityRepresentation(model)
    default:
      throw new Error(`Unknown representation type: ${type}`)
  }
}
