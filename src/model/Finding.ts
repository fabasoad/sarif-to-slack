import type { ReportingDescriptor, Result } from 'sarif'
import { type RunData, SecurityLevel, SecuritySeverity } from '../types'
import Logger from '../Logger'
import type { CommonProcessor } from '../processors/CommonProcessor'
import { createProcessor } from '../processors/ProcessorFactory'

/**
 * Parameters that are needed for the new {@link Finding} instance creation.
 * @internal
 */
export type FindingOptions = {
  sarifPath: string,
  runMetadata: RunData,
  result: Result,
}

/**
 * This interface represents a finding from SARIF file.
 * @internal
 */
export default interface Finding {
  get sarifPath(): string,
  get runId(): number,
  get toolName(): string,
  get cvssScore(): number | undefined,
  get level(): SecurityLevel,
  get severity(): SecuritySeverity,
  clone(): Finding,
}

/**
 * Creates a new instance of {@link Finding} class.
 * @internal
 */
export function createFinding(opts: FindingOptions): Finding {
  return new FindingImpl(opts)
}

/**
 * The only implementation of {@link Finding} interface. This class is private
 * and is not supposed to be exposed. {@link createFinding} should be used to
 * create a new {@link Finding}.
 * @private
 */
class FindingImpl implements Finding {
  private readonly _logger = new Logger('FindingImpl');
  private readonly _runMetadata: RunData;
  private readonly _result: Result;
  private readonly _sarifPath: string;
  private readonly _rule?: ReportingDescriptor;
  private readonly _processor: CommonProcessor;

  private _cvssScoreCacheProcessed: boolean = false;
  private _cvssScoreCache: number | undefined = undefined;

  private _levelCacheProcessed: boolean = false;
  private _levelCache: Result.level | undefined = undefined;

  constructor(opts: FindingOptions) {
    this._processor = createProcessor(opts.runMetadata.run, opts.result)
    this._sarifPath = opts.sarifPath
    this._runMetadata = opts.runMetadata
    this._result = opts.result
    this._rule = this._processor.tryFindRule()
  }

  clone(): Finding {
    return createFinding({
      sarifPath: this._sarifPath,
      runMetadata: this._runMetadata,
      result: this._result
    })
  }

  public get sarifPath(): string {
    return this._sarifPath
  }

  public get runId(): number {
    return this._runMetadata.id
  }

  public get toolName(): string {
    return this._processor.findToolComponent().name
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
      this._logger.debug(`Unknown level of ${this._rule?.id} rule`)
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
      this._logger.debug(`Unsupported CVSS score ${this.cvssScore} in ${this._rule?.id} rule`)
      return SecuritySeverity.Unknown
    }

    if (this.cvssScore >= 9) {
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
