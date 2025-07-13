import type { Result, Run } from 'sarif';
import { tryGetRulePropertyByResult } from '../utils/SarifUtils'
import { SecurityLevel, SecuritySeverity, SecuritySeverityOrder, SecurityLevelOrder } from './types'
import Logger from '../Logger'
import { Map as ImmutableMap } from 'immutable'

export class SarifModelPerRun {
  public readonly toolName: string

  private readonly _securitySeverityMap: ImmutableMap<SecuritySeverity, number>
  private readonly _securityLevelMap: ImmutableMap<SecurityLevel, number>

  constructor(run: Run) {
    this.toolName = run.tool.driver.name

    this._securitySeverityMap = ImmutableMap<SecuritySeverity, number>().asMutable()
    this._securityLevelMap = ImmutableMap<SecurityLevel, number>().asMutable()

    this.buildSecuritySeverityMap(run)
    this.buildSecurityLevelMap(run)
  }

  private identifySecuritySeverity(score?: number): SecuritySeverity {
    if (score === undefined) {
      return SecuritySeverity.UNKNOWN
    }

    if (score >= 9 && score <= 10) {
      return SecuritySeverity.CRITICAL
    }

    if (score >= 7) {
      return SecuritySeverity.HIGH
    }

    if (score >= 4) {
      return SecuritySeverity.MEDIUM
    }

    if (score >= 0.1) {
      return SecuritySeverity.LOW
    }

    if (score == 0) {
      return SecuritySeverity.NONE
    }

    Logger.warn(`Unsupported "${score}" security severity. Saving as "Unknown".`)
    return SecuritySeverity.UNKNOWN
  }

  private identifySecurityLevel(level?: string): SecurityLevel {
    if (level === undefined) {
      return SecurityLevel.UNKNOWN
    }

    if (level.toLowerCase() === 'error') {
      return SecurityLevel.ERROR
    }

    if (level.toLowerCase() === 'warning') {
      return SecurityLevel.WARNING
    }

    if (level.toLowerCase() === 'note') {
      return SecurityLevel.NOTE
    }

    Logger.warn(`Unsupported ${level} security level. Saving as "Unknown".`)
    return SecurityLevel.UNKNOWN
  }

  private buildSecuritySeverityMap(run: Run): void {
    const results: Result[] = run.results ?? []
    for (const result of results) {
      const severity: SecuritySeverity = this.identifySecuritySeverity(
        tryGetRulePropertyByResult(run, result, 'security-severity')
      )
      const count: number = this._securitySeverityMap.get(severity) || 0
      this._securitySeverityMap.set(severity, count + 1)
    }
  }

  private tryGetSecurityLevel(run: Run, result: Result): string | undefined {
    if (result.level) {
      return result.level
    }

    return tryGetRulePropertyByResult(run, result, 'problem.severity')
  }

  private buildSecurityLevelMap(run: Run): void {
    const results: Result[] = run.results ?? []
    for (const result of results) {
      const level: SecurityLevel = this.identifySecurityLevel(
        this.tryGetSecurityLevel(run, result)
      )
      const count: number = this._securityLevelMap.get(level) || 0
      this._securityLevelMap.set(level, count + 1)
    }
  }

  public get securitySeverityMap(): ImmutableMap<SecuritySeverity, number> {
    return this._securitySeverityMap.sortBy(
      (_: number, severity: SecuritySeverity): SecuritySeverity => severity,
      (a: SecuritySeverity, b: SecuritySeverity): number => SecuritySeverityOrder.indexOf(a) - SecuritySeverityOrder.indexOf(b),
    ).asImmutable()
  }

  public get securityLevelMap(): ImmutableMap<SecurityLevel, number> {
    return this._securityLevelMap.sortBy(
      (_: number, level: SecurityLevel): SecurityLevel => level,
      (a: SecurityLevel, b: SecurityLevel): number => SecurityLevelOrder.indexOf(a) - SecurityLevelOrder.indexOf(b),
    ).asImmutable()
  }
}
