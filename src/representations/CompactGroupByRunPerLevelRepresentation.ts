import CompactGroupByRunRepresentation from './CompactGroupByRunRepresentation';

export default class CompactGroupByRunPerLevelRepresentation extends CompactGroupByRunRepresentation {

  public override compose(): string {
    return this.composeByProperty('level')
  }
}
