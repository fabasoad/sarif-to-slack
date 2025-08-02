import { CommonProcessor } from './CommonProcessor'
import { Result } from 'sarif';

export class CodeQLProcessor extends CommonProcessor {

  public override tryFindLevel(): Result.level | undefined {
    return super.tryFindLevel() ?? this.tryFindRuleProperty('problem.severity')
  }
}
