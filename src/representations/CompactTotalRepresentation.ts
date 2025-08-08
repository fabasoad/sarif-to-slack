import { Finding } from '../model/Finding'
import CompactGroupByRepresentation from './CompactGroupByRepresentation'

export default abstract class CompactTotalRepresentation extends CompactGroupByRepresentation {

  public constructor(findings: Finding[]) {
    super(findings, 'level')
  }

  protected override composeGroupTitle(): string {
    return 'Total'
  }
}
