import { CommonProcessor } from './CommonProcessor'

/**
 * This class has extra logic for processing SARIF files produced by Snyk Open
 * Source tool.
 * @internal
 */
export class SnykProcessor extends CommonProcessor {

  /**
   * Rules in SARIF files produced by Snyk Open Source has additional "cvssv3_baseScore"
   * property where CVSS score is also defined. This method tries to get level
   * from this "cvssv3_baseScore" property and if it fails to do so, then it tries
   * to get CVSS score in a common way.
   */
  public override tryFindCvssScore(): number | undefined {
    return this.tryFindRuleProperty<number>('cvssv3_baseScore') ?? super.tryFindCvssScore()
  }
}
