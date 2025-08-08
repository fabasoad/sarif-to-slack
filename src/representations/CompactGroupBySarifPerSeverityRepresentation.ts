import CompactGroupBySarifRepresentation
  from './CompactGroupBySarifRepresentation'

export class CompactGroupBySarifPerSeverityRepresentation extends CompactGroupBySarifRepresentation {

  public override compose(): string {
    return this.composeByProperty('severity')
  }
}
