import CompactGroupByRepresentation from './CompactGroupByRepresentation'
import { Finding } from '../model/Finding'

export default abstract class CompactTotalRepresentation extends CompactGroupByRepresentation {

  protected override groupFindings(): Map<string, Finding[]> {
    const result = new Map<string, Finding[]>()
    if (this._model.findings.length > 0) {
      result.set('Total', this._model.findings)
    }
    return result
  }
}
