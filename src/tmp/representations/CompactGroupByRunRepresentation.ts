import { Finding } from '../model/Finding'
import CompactGroupByRepresentation from './CompactGroupByRepresentation'

export default abstract class CompactGroupByRunRepresentation extends CompactGroupByRepresentation {

  public constructor(findings: Finding[]) {
    super(findings, 'runId')
  }

  protected override composeGroupTitle(f: Finding): string {
    const run: string = this.italic(`[Run ${f.runId}]`)
    const toolName: string = this.bold(f.toolName)
    return `${run}: ${toolName}`
  }
}
