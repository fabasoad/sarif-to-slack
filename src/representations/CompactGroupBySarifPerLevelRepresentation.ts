import CompactGroupBySarifRepresentation
  from './CompactGroupBySarifRepresentation'

export class CompactGroupBySarifPerLevelRepresentation extends CompactGroupBySarifRepresentation {

  public override compose(): string {
    return this.composeByProperty('level')
  }
}
