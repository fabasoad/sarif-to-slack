import { CommonProcessor } from './CommonProcessor'

export class SnykProcessor extends CommonProcessor {

  public override findCvssScore(): number | undefined {
    return this.tryFindRuleProperty<number>('cvssv3_baseScore') ?? super.tryFindCvssScore()
  }
}
