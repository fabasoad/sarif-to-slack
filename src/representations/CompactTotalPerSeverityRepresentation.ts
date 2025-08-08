import CompactTotalRepresentation from './CompactTotalRepresentation'

export class CompactTotalPerSeverityRepresentation extends CompactTotalRepresentation {

  public override compose(): string {
    return this.composeByProperty('severity')
  }
}
