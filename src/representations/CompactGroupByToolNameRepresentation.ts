import { Finding } from '../model/Finding'
import CompactGroupByRepresentation, {
  GroupBy
} from './CompactGroupByRepresentation'
import { SarifModel } from '../types'

export default abstract class CompactGroupByToolNameRepresentation extends CompactGroupByRepresentation {

  public constructor(model: SarifModel) {
    super(model, 'toolName')
  }

  protected override get groupBy(): GroupBy {
    return GroupBy.ToolName
  }

  protected override composeGroupTitle(f: Finding): string {
    return this.bold(f.toolName);
  }
}
