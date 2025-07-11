import type { Sarif } from '../types'
import { SarifModelPerRun } from './SarifModelPerRun'
import { SecurityLevel, SecuritySeverity } from './types'

export class SarifModelPerSarif {
  private readonly sarifModelPerRunList: Array<SarifModelPerRun>;

  constructor(sarif: Sarif) {
    this.sarifModelPerRunList = new Array<SarifModelPerRun>()
    this.buildRunsList(sarif)
  }

  private buildRunsList(sarif: Sarif): void {
    for (const run of sarif.runs) {
      this.sarifModelPerRunList.push(new SarifModelPerRun(run))
    }
  }

  public groupByToolNameWithSecurityLevel(): Map<string, Map<SecurityLevel, number>> {
    const result = new Map<string, Map<SecurityLevel, number>>()
    for (const sarifModelPerRun of this.sarifModelPerRunList) {
      if (!result.has(sarifModelPerRun.toolName)) {
        result.set(sarifModelPerRun.toolName, new Map<SecurityLevel, number>())
      }
      for (const [k, v] of sarifModelPerRun.securityLevelMap.entries()) {
        const count: number = result.get(sarifModelPerRun.toolName)?.get(k) || 0
        result.get(sarifModelPerRun.toolName)?.set(k, count + v)
      }
    }
    return result
  }

  public totalWithSecurityLevel(): Map<SecurityLevel, number> {
    const result = new Map<SecurityLevel, number>()
    for (const sarifModelPerRun of this.sarifModelPerRunList) {
      for (const [k, v] of sarifModelPerRun.securityLevelMap.entries()) {
        const count: number = result.get(k) || 0
        result.set(k, count + v)
      }
    }
    return result
  }

  public groupByToolNameWithSecuritySeverity(): Map<string, Map<SecuritySeverity, number>> {
    const result = new Map<string, Map<SecuritySeverity, number>>()
    for (const sarifModelPerRun of this.sarifModelPerRunList) {
      if (!result.has(sarifModelPerRun.toolName)) {
        result.set(sarifModelPerRun.toolName, new Map<SecuritySeverity, number>())
      }
      for (const [k, v] of sarifModelPerRun.securitySeverityMap.entries()) {
        const count: number = result.get(sarifModelPerRun.toolName)?.get(k) || 0
        result.get(sarifModelPerRun.toolName)?.set(k, count + v)
      }
    }
    return result
  }

  public totalWithSecuritySeverity(): Map<SecuritySeverity, number> {
    const result = new Map<SecuritySeverity, number>()
    for (const sarifModelPerRun of this.sarifModelPerRunList) {
      for (const [k, v] of sarifModelPerRun.securitySeverityMap.entries()) {
        const count: number = result.get(k) || 0
        result.set(k, count + v)
      }
    }
    return result
  }
}
