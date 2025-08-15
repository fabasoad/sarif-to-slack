import CompactTotalRepresentation from './CompactTotalRepresentation'

/**
 * Since {@link CompactTotalRepresentation} is an abstract class, the only
 * question that this class should "answer" is what property should be used in
 * the compact representation. In this case it is "severity".
 * @internal
 */
export default class CompactTotalPerSeverityRepresentation extends CompactTotalRepresentation {

  public override compose(): string {
    return this.composeByProperty('severity')
  }
}
