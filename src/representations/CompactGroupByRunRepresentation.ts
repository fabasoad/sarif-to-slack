import { Finding } from '../model/Finding'
import CompactGroupByRepresentation, {
  GroupBy
} from './CompactGroupByRepresentation'
import { SarifModel } from '../types'

export default abstract class CompactGroupByRunRepresentation extends CompactGroupByRepresentation {

  public constructor(model: SarifModel) {
    super(model, 'runId')
  }

  protected override get groupBy(): GroupBy {
    return GroupBy.Run
  }

  protected override composeGroupTitle(f: Finding): string {
    const prefix: string = this.italic(`[Run ${f.runId}]`)
    const toolName: string = this.bold(f.toolName)
    return `${prefix} ${toolName}`
  }
}
