import type Finding from './Finding'
import { SecurityLevel, SecuritySeverity } from '../types'
import ExtendedArray from '../utils/ExtendedArray'

/**
 * This class represents an array of {@link Finding} objects and adds additional
 * useful methods to it.
 * @internal
 */
export default class FindingArray extends ExtendedArray<Finding> {

  public hasSeverityOrHigher(severity: SecuritySeverity): boolean {
    return Object
      .values(SecuritySeverity)
      .filter((v: string | SecuritySeverity): v is SecuritySeverity => typeof v === 'number')
      .filter((v: SecuritySeverity): boolean => v >= severity)
      .some((v: SecuritySeverity): boolean => this.findByProperty('severity', v) != null)
  }

  public hasLevelOrHigher(level: SecurityLevel): boolean {
    return Object
      .values(SecurityLevel)
      .filter((v: string | SecurityLevel): v is SecurityLevel => typeof v === 'number')
      .filter((v: SecurityLevel): boolean => v >= level)
      .some((v: SecurityLevel): boolean => this.findByProperty('level', v) != null)
  }
}
