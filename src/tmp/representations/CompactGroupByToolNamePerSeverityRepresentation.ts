import CompactGroupByToolNameRepresentation
  from './CompactGroupByToolNameRepresentation';

export default class CompactGroupByToolNamePerSeverityRepresentation extends CompactGroupByToolNameRepresentation {

  public override compose(): string {
    return this.composeByProperty('severity')
  }
}
