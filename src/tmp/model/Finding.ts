import type { ReportingDescriptor, Result, Run } from 'sarif'
import { SecurityLevel, SecuritySeverity } from '../types'
import Logger from '../../Logger'
import { CommonProcessor } from '../processors/CommonProcessor'
import { createProcessor } from '../processors/ProcessorFactory'

export type ToolName = {
  driver: string,
  extension?: string,
}

export type RunOptions = {
  id: string,
  run: Run,
}

export type FindingOptions = {
  sarifPath: string,
  runOpts: RunOptions,
  result: Result,
}

export interface Finding {
  get sarifPath(): string,
  get runId(): string,
  get toolName(): ToolName,
  get cvssScore(): number | undefined,
  get level(): SecurityLevel,
  get severity(): SecuritySeverity,
}

export function createFinding(opts: FindingOptions): Finding {
  return new SarifFinding(opts)
}

class SarifFinding implements Finding {
  private readonly _runId: string
  private readonly _sarifPath: string
  private readonly _rule?: ReportingDescriptor
  private readonly _processor: CommonProcessor

  private _cvssScoreCacheProcessed: boolean = false
  private _cvssScoreCache: number | undefined = undefined

  private _levelCacheProcessed: boolean = false
  private _levelCache: Result.level | undefined = undefined

  constructor(opts: FindingOptions) {
    this._processor = createProcessor(opts.runOpts.run, opts.result)
    this._sarifPath = opts.sarifPath
    this._runId = opts.runOpts.id
    this._rule = this._processor.tryFindRule()
  }

  public get sarifPath(): string {
    return this._sarifPath
  }

  public get runId(): string {
    return this._runId
  }

  public get toolName(): ToolName {
    return {
      driver: this._processor.findToolComponentDriver().name,
      extension: this._processor.tryFindToolComponentExtension()?.name,
    }
  }

  public get cvssScore(): number | undefined {
    if (!this._cvssScoreCacheProcessed) {
      this._cvssScoreCacheProcessed = true
      this._cvssScoreCache = this._processor.tryFindCvssScore()
    }
    return this._cvssScoreCache
  }

  public get level(): SecurityLevel {
    if (!this._levelCacheProcessed) {
      this._levelCacheProcessed = true
      this._levelCache = this._processor.tryFindLevel()
    }

    if (this._levelCache === undefined) {
      Logger.debug(`Unknown level of ${this._rule?.id} rule`)
      return SecurityLevel.Unknown
    }

    switch (this._levelCache) {
      case 'error': return SecurityLevel.Error
      case 'warning': return SecurityLevel.Warning
      case 'note': return SecurityLevel.Note
      default: return SecurityLevel.None
    }
  }

  public get severity(): SecuritySeverity {
    if (this.cvssScore == null || this.cvssScore < 0 || this.cvssScore > 10) {
      Logger.debug(`Unsupported CVSS score ${this.cvssScore} in ${this._rule?.id} rule`)
      return SecuritySeverity.Unknown
    }

    if (this.cvssScore >= 9 && this.cvssScore <= 10) {
      return SecuritySeverity.Critical
    }

    if (this.cvssScore >= 7) {
      return SecuritySeverity.High
    }

    if (this.cvssScore >= 4) {
      return SecuritySeverity.Medium
    }

    if (this.cvssScore >= 0.1) {
      return SecuritySeverity.Low
    }

    return SecuritySeverity.None
  }
}
