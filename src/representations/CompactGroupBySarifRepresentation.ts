import path from 'node:path'
import { Finding } from '../model/Finding'
import CompactGroupByRepresentation from './CompactGroupByRepresentation'
import { SarifModel } from '../types'

export default abstract class CompactGroupBySarifRepresentation extends CompactGroupByRepresentation {

  public constructor(model: SarifModel) {
    super(model, 'sarifPath')
  }

  protected override groupFindings(): Map<string, Finding[]> {
    const result = new Map<string, Finding[]>()
    for (let index = 0; index < this._model.sarifFiles.length; index++) {
      const key: string = this.composeGroupTitle(this._model.sarifFiles[index], index)
      if (result.get(key) == null) {
        result.set(key, [])
      }
      this._model.findings
        .filter((f: Finding): boolean => f.sarifPath === this._model.sarifFiles[index])
        .forEach((f: Finding) => result.get(key)?.push(f))
    }
    return result
  }

  private composeGroupTitle(sarifPath: string, index: number): string {
    return `${this.italic(`[File ${index + 1}]`)} ${this.bold(path.basename(sarifPath))}`
  }
}
