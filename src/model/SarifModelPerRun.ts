import type { Result, Run } from 'sarif';
import {
  findToolComponentByResult,
  tryGetRulePropertyByResult
} from '../utils/SarifUtils'
import { SecurityLevel, SecuritySeverity } from './types'
import Logger from '../Logger'
import { Map as ImmutableMap } from 'immutable'
import {
  sortSecurityLevelMap,
  sortSecuritySeverityMap
} from '../utils/SortUtils';

/**
 * This class keeps information about results per run. It has 2 hash maps:
 * - severity to number: the amount of results for each severity
 * - level to number: the amount of results for each level
 * @internal
 */
export class SarifModelPerRun {
  public readonly toolName: string

  private readonly _securitySeverityMap: ImmutableMap<SecuritySeverity, number>
  private readonly _securityLevelMap: ImmutableMap<SecurityLevel, number>

  constructor(run: Run) {
    this.toolName = findToolComponentByResult(run, run.results?.[0]).name

    this._securitySeverityMap = ImmutableMap<SecuritySeverity, number>().asMutable()
    this._securityLevelMap = ImmutableMap<SecurityLevel, number>().asMutable()

    this.buildSecuritySeverityMap(run)
    this.buildSecurityLevelMap(run)
  }

  private identifySecuritySeverity(score?: number): SecuritySeverity {
    if (score === undefined) {
      return SecuritySeverity.Unknown
    }

    if (score >= 9 && score <= 10) {
      return SecuritySeverity.Critical
    }

    if (score >= 7) {
      return SecuritySeverity.High
    }

    if (score >= 4) {
      return SecuritySeverity.Medium
    }

    if (score >= 0.1) {
      return SecuritySeverity.Low
    }

    if (score == 0) {
      return SecuritySeverity.None
    }

    Logger.warn(`Unsupported "${score}" security severity. Saving as "Unknown".`)
    return SecuritySeverity.Unknown
  }

  private identifySecurityLevel(level?: string): SecurityLevel {
    if (level === undefined) {
      return SecurityLevel.Unknown
    }

    if (level.toLowerCase() === 'error') {
      return SecurityLevel.Error
    }

    if (level.toLowerCase() === 'warning') {
      return SecurityLevel.Warning
    }

    if (level.toLowerCase() === 'note') {
      return SecurityLevel.Note
    }

    Logger.warn(`Unsupported ${level} security level. Saving as "Unknown".`)
    return SecurityLevel.Unknown
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
    return sortSecuritySeverityMap(this._securitySeverityMap)
  }

  public get securityLevelMap(): ImmutableMap<SecurityLevel, number> {
    return sortSecurityLevelMap(this._securityLevelMap)
  }
}
