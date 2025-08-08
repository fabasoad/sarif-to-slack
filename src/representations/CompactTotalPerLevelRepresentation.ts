import CompactTotalRepresentation from './CompactTotalRepresentation'

export class CompactTotalPerLevelRepresentation extends CompactTotalRepresentation {

  public override compose(): string {
    return this.composeByProperty('level')
  }
}
