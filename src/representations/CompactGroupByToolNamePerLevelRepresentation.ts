import CompactGroupByToolNameRepresentation
  from './CompactGroupByToolNameRepresentation';

export default class CompactGroupByToolNamePerLevelRepresentation extends CompactGroupByToolNameRepresentation {

  public override compose(): string {
    return this.composeByProperty('level')
  }
}
