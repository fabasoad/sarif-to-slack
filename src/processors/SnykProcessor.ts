import { CommonProcessor } from './CommonProcessor'

export class SnykProcessor extends CommonProcessor {

  public override tryFindCvssScore(): number | undefined {
    return this.tryFindRuleProperty<number>('cvssv3_baseScore') ?? super.tryFindCvssScore()
  }
}
