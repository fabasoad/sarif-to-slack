import CompactGroupByRunRepresentation from './CompactGroupByRunRepresentation';

export default class CompactGroupByRunPerSeverityRepresentation extends CompactGroupByRunRepresentation {

  public override compose(): string {
    return this.composeByProperty('severity')
  }
}
