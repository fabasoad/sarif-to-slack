import Representation from './Representation'
import { Finding } from '../model/Finding'
import CompactGroupByRunPerLevelRepresentation
  from './CompactGroupByRunPerLevelRepresentation'
import CompactGroupByRunPerSeverityRepresentation
  from './CompactGroupByRunPerSeverityRepresentation'
import CompactGroupByToolNamePerLevelRepresentation
  from './CompactGroupByToolNamePerLevelRepresentation'
import CompactGroupByToolNamePerSeverityRepresentation
  from './CompactGroupByToolNamePerSeverityRepresentation'

export enum RepresentationType {
  CompactGroupByRunPerLevel = 0,
  CompactGroupByRunPerSeverity = 1,
  CompactGroupByToolNamePerLevel = 2,
  CompactGroupByToolNamePerSeverity = 3,
}

export function createRepresentation(
  type: RepresentationType,
  findings: Finding[]
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
    default:
      throw new Error(`Unknown representation type: ${type}`)
  }
}
