import type { Sarif } from '../types'
import { Map as ImmutableMap } from 'immutable'
import { SarifModelPerRun } from './SarifModelPerRun'
import { SecurityLevel, SecuritySeverity } from './types'
import {
  sortSecurityLevelMap,
  sortSecuritySeverityMap
} from '../utils/SortUtils';

export type DataGroupedByRun<T> = {
  toolName: string,
  data: ImmutableMap<T, number>
}

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

  public groupByToolNameWithSecurityLevel(): Map<string, ImmutableMap<SecurityLevel, number>> {
    const result = new Map<string, ImmutableMap<SecurityLevel, number>>()
    for (const sarifModelPerRun of this.sarifModelPerRunList) {
      if (!result.has(sarifModelPerRun.toolName)) {
        result.set(sarifModelPerRun.toolName, ImmutableMap<SecurityLevel, number>().asMutable())
      }
      for (const [k, v] of sarifModelPerRun.securityLevelMap.entries()) {
        const count: number = result.get(sarifModelPerRun.toolName)?.get(k) || 0
        result.get(sarifModelPerRun.toolName)?.set(k, count + v)
      }
    }
    // Sort
    for (const [k, v] of result) {
      result.set(k, sortSecurityLevelMap(v))
    }
    return result
  }

  public groupByRunWithSecurityLevel(): DataGroupedByRun<SecurityLevel>[] {
    const result = new Array<DataGroupedByRun<SecurityLevel>>()
    for (const sarifModelPerRun of this.sarifModelPerRunList) {
      result.push({
        toolName: sarifModelPerRun.toolName,
        data: sarifModelPerRun.securityLevelMap,
      })
    }
    return result
  }

  public groupByTotalWithSecurityLevel(): ImmutableMap<SecurityLevel, number> {
    const result = ImmutableMap<SecurityLevel, number>().asMutable()
    for (const sarifModelPerRun of this.sarifModelPerRunList) {
      for (const [k, v] of sarifModelPerRun.securityLevelMap.entries()) {
        const count: number = result.get(k) || 0
        result.set(k, count + v)
      }
    }
    return sortSecurityLevelMap(result)
  }

  public groupByToolNameWithSecuritySeverity(): Map<string, ImmutableMap<SecuritySeverity, number>> {
    const result = new Map<string, ImmutableMap<SecuritySeverity, number>>()
    for (const sarifModelPerRun of this.sarifModelPerRunList) {
      if (!result.has(sarifModelPerRun.toolName)) {
        result.set(sarifModelPerRun.toolName, ImmutableMap<SecuritySeverity, number>().asMutable())
      }
      for (const [k, v] of sarifModelPerRun.securitySeverityMap.entries()) {
        const count: number = result.get(sarifModelPerRun.toolName)?.get(k) || 0
        result.get(sarifModelPerRun.toolName)?.set(k, count + v)
      }
    }
    // Sort
    for (const [k, v] of result.entries()) {
      result.set(k, sortSecuritySeverityMap(v))
    }
    return result
  }

  public groupByRunWithSecuritySeverity(): DataGroupedByRun<SecuritySeverity>[] {
    const result = new Array<DataGroupedByRun<SecuritySeverity>>()
    for (const sarifModelPerRun of this.sarifModelPerRunList) {
      result.push({
        toolName: sarifModelPerRun.toolName,
        data: sarifModelPerRun.securitySeverityMap,
      })
    }
    return result
  }

  public groupByTotalWithSecuritySeverity(): ImmutableMap<SecuritySeverity, number> {
    const result = ImmutableMap<SecuritySeverity, number>().asMutable()
    for (const sarifModelPerRun of this.sarifModelPerRunList) {
      for (const [k, v] of sarifModelPerRun.securitySeverityMap.entries()) {
        const count: number = result.get(k) || 0
        result.set(k, count + v)
      }
    }
    return sortSecuritySeverityMap(result)
  }

  public listToolNames(): Set<string> {
    const toolNames = new Set<string>()
    for (const sarifModelPerRun of this.sarifModelPerRunList) {
      toolNames.add(sarifModelPerRun.toolName)
    }
    return toolNames
  }
}
