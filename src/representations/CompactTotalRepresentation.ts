import CompactGroupByRepresentation from './CompactGroupByRepresentation'
import Finding from '../model/Finding'

/**
 * Since {@link CompactGroupByRepresentation} already prepares compact representation
 * of findings, this class defines a grouping rule. In this case it does not really
 * group, but just add everything under the same "Total" group, such as:
 * @example
 * ```text
 * Total
 * Warning: 1, Note: 20
 * ```
 * It is an abstract class, so the only question that derived classes should
 * "answer" is what property should be used in the compact representation, such
 * as "level" and "severity".
 * @internal
 */
export default abstract class CompactTotalRepresentation extends CompactGroupByRepresentation {

  protected override groupFindings(): Map<string, Finding[]> {
    const result = new Map<string, Finding[]>()
    if (this._model.findings.length > 0) {
      result.set('Total', this._model.findings)
    }
    return result
  }
}
