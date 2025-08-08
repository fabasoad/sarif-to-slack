import Representation from './Representation'
import { Finding } from '../model/Finding'
import { RepresentationType } from '../types'
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
  findings: Finding[],
  type: RepresentationType = RepresentationType.CompactGroupByToolNamePerSeverity
): Representation {
  switch (type) {
    case RepresentationType.CompactGroupByRunPerLevel:
      return new CompactGroupByRunPerLevelRepresentation(findings)
    case RepresentationType.CompactGroupByRunPerSeverity:
      return new CompactGroupByRunPerSeverityRepresentation(findings)
    case RepresentationType.CompactGroupByToolNamePerLevel:
      return new CompactGroupByToolNamePerLevelRepresentation(findings)
    case RepresentationType.CompactGroupByToolNamePerSeverity:
      return new CompactGroupByToolNamePerSeverityRepresentation(findings)
    case RepresentationType.CompactGroupBySarifPerLevel:
      return new CompactGroupBySarifPerLevelRepresentation(findings)
    case RepresentationType.CompactGroupBySarifPerSeverity:
      return new CompactGroupBySarifPerSeverityRepresentation(findings)
    case RepresentationType.CompactTotalPerLevel:
      return new CompactTotalPerLevelRepresentation(findings)
    case RepresentationType.CompactTotalPerSeverity:
      return new CompactTotalPerSeverityRepresentation(findings)
    default:
      throw new Error(`Unknown representation type: ${type}`)
  }
}
