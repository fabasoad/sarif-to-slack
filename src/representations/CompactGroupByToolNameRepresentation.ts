import type Finding from '../model/Finding'
import CompactGroupByRepresentation from './CompactGroupByRepresentation'
import type { SarifModel } from '../types'

/**
 * Since {@link CompactGroupByRepresentation} already prepares compact representation
 * of findings, this class defines a grouping rule. In this case it groups
 * findings by tool name. Every tool name will be grouped separately, such as:
 * @example
 * ```text
 * Grype
 * Error: 1, Warning: 4
 * Trivy
 * Warning: 1, Note: 20
 * ```
 * It is an abstract class, so the only question that derived classes should
 * "answer" is what property should be used in the compact representation, such
 * as "level" and "severity".
 * @internal
 */
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
