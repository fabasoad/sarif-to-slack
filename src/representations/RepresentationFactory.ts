import type Representation from './Representation'
import { RepresentationType, type SarifModel } from '../types'
import CompactGroupByRunPerLevelRepresentation
  from './CompactGroupByRunPerLevelRepresentation'
import CompactGroupByRunPerSeverityRepresentation
  from './CompactGroupByRunPerSeverityRepresentation'
import CompactGroupByToolNamePerLevelRepresentation
  from './CompactGroupByToolNamePerLevelRepresentation'
import CompactGroupByToolNamePerSeverityRepresentation
  from './CompactGroupByToolNamePerSeverityRepresentation'
import CompactGroupBySarifPerLevelRepresentation
  from './CompactGroupBySarifPerLevelRepresentation'
import CompactGroupBySarifPerSeverityRepresentation
  from './CompactGroupBySarifPerSeverityRepresentation'
import CompactTotalPerSeverityRepresentation
  from './CompactTotalPerSeverityRepresentation'
import CompactTotalPerLevelRepresentation
  from './CompactTotalPerLevelRepresentation'
import TableGroupByToolNamePerLevelRepresentation
  from './TableGroupByToolNamePerLevelRepresentation'
import TableGroupByToolNamePerSeverityRepresentation
  from './TableGroupByToolNamePerSeverityRepresentation'
import TableGroupByRunPerLevelRepresentation
  from './TableGroupByRunPerLevelRepresentation'
import TableGroupByRunPerSeverityRepresentation
  from './TableGroupByRunPerSeverityRepresentation'
import TableGroupBySarifPerLevelRepresentation
  from './TableGroupBySarifPerLevelRepresentation'
import TableGroupBySarifPerSeverityRepresentation
  from './TableGroupBySarifPerSeverityRepresentation'

/**
 * Factory class that creates a {@link Representation} class based on the provided
 * {@link RepresentationType}.
 * @internal
 */
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
    case RepresentationType.TableGroupByRunPerLevel:
      return new TableGroupByRunPerLevelRepresentation(model)
    case RepresentationType.TableGroupByRunPerSeverity:
      return new TableGroupByRunPerSeverityRepresentation(model)
    case RepresentationType.TableGroupByToolNamePerLevel:
      return new TableGroupByToolNamePerLevelRepresentation(model)
    case RepresentationType.TableGroupByToolNamePerSeverity:
      return new TableGroupByToolNamePerSeverityRepresentation(model)
    case RepresentationType.TableGroupBySarifPerLevel:
      return new TableGroupBySarifPerLevelRepresentation(model)
    case RepresentationType.TableGroupBySarifPerSeverity:
      return new TableGroupBySarifPerSeverityRepresentation(model)
    default:
      throw new Error(`Unknown representation type: ${type}`)
  }
}
