import { Map as ImmutableMap } from 'immutable'
import {
  SecurityLevel,
  SecurityLevelOrder,
  SecuritySeverity,
  SecuritySeverityOrder
} from '../model/types'

/**
 * This function sorts the given map by security level.
 * See {@link SecurityLevelOrder}.
 * @param map A map that you need to sort.
 * @internal
 */
export function sortSecurityLevelMap(map: ImmutableMap<SecurityLevel, number>): ImmutableMap<SecurityLevel, number> {
  return map.sortBy(
    (_: number, level: SecurityLevel): SecurityLevel => level,
    (a: SecurityLevel, b: SecurityLevel): number => SecurityLevelOrder.indexOf(a) - SecurityLevelOrder.indexOf(b),
  ).asImmutable()
}

/**
 * This function sorts the given map by security severity.
 * See {@link SecuritySeverityOrder}.
 * @param map A map that you need to sort.
 * @internal
 */
export function sortSecuritySeverityMap(map: ImmutableMap<SecuritySeverity, number>): ImmutableMap<SecuritySeverity, number> {
  return map.sortBy(
    (_: number, severity: SecuritySeverity): SecuritySeverity => severity,
    (a: SecuritySeverity, b: SecuritySeverity): number => SecuritySeverityOrder.indexOf(a) - SecuritySeverityOrder.indexOf(b),
  ).asImmutable()
}
