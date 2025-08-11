import { Finding } from './Finding'
import ExtendedArray from '../utils/ExtendedArray'
import { SecurityLevel, SecuritySeverity } from '../types'

export default class FindingsArray extends ExtendedArray<Finding> {

  public hasSeverityOrHigher(severity: SecuritySeverity): boolean {
    return Object
      .values(SecuritySeverity)
      .filter((v: string | SecuritySeverity): v is SecuritySeverity => typeof v === 'number')
      .filter((v: SecuritySeverity): boolean => v >= severity)
      .some((v: SecuritySeverity) => this.findByProperty('severity', v) != null)
  }

  public hasLevelOrHigher(level: SecurityLevel): boolean {
    return Object
      .values(SecurityLevel)
      .filter((v: string | SecurityLevel): v is SecurityLevel => typeof v === 'number')
      .filter((v: SecurityLevel): boolean => v >= level)
      .some((v: SecurityLevel) => this.findByProperty('level', v) != null)
  }
}
