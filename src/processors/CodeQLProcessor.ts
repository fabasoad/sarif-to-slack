import { CommonProcessor } from './CommonProcessor'
import { Result } from 'sarif';

/**
 * This class has extra logic for processing SARIF files produced by CodeQL tool.
 * @internal
 */
export class CodeQLProcessor extends CommonProcessor {

  /**
   * Rules in SARIF files produced by CodeQL has additional "problem.severity"
   * property where level is also defined. This method tries to get level in a
   * common way but if it fails to do so, then it tries to get level from
   * "problem.severity" property.
   */
  public override tryFindLevel(): Result.level | undefined {
    return super.tryFindLevel() ?? this.tryFindRuleProperty('problem.severity')
  }
}
