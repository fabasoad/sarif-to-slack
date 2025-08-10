import CompactGroupByRepresentation, {
  GroupBy
} from './CompactGroupByRepresentation'

export default abstract class CompactTotalRepresentation extends CompactGroupByRepresentation {

  protected override get groupBy(): GroupBy {
    return GroupBy.Total
  }

  protected override composeGroupTitle(): string {
    return 'Total'
  }
}
