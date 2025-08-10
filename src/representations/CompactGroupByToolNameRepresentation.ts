import { Finding } from '../model/Finding'
import CompactGroupByRepresentation from './CompactGroupByRepresentation'
import { SarifModel } from '../types'

export default abstract class CompactGroupByToolNameRepresentation extends CompactGroupByRepresentation {

  public constructor(model: SarifModel) {
    super(model, 'toolName')
  }

  protected override groupFindings(): Map<string, Finding[]> {
    const result = new Map<string, Finding[]>()
    for (const run of this._model.runs) {
      const key: string = this.composeGroupTitle(run.toolName)
      if (result.get(key) == null) {
        result.set(key, [])
      }
      this._model.findings
        .filter((f: Finding): boolean => f.runId === run.id)
        .forEach((f: Finding) => result.get(key)?.push(f))
    }
    return result
  }

  private composeGroupTitle(toolName: string): string {
    return this.bold(toolName)
  }
}
