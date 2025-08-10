import { Finding } from '../model/Finding'
import CompactGroupByRepresentation, {
  GroupBy
} from './CompactGroupByRepresentation'
import path from 'node:path'
import { SarifModel } from '../types'

export default abstract class CompactGroupBySarifRepresentation extends CompactGroupByRepresentation {
  private readonly _cache: string[] = []

  public constructor(model: SarifModel) {
    super(model, 'sarifPath')
  }

  protected override get groupBy(): GroupBy {
    return GroupBy.Sarif
  }

  protected override composeGroupTitle(f: Finding): string {
    if (!this._cache.includes(f.sarifPath)) {
      this._cache.push(f.sarifPath)
    }
    const prefix: string = this.italic(`[File ${this._cache.indexOf(f.sarifPath) + 1}]`)
    const sarifPath: string = this.bold(path.basename(f.sarifPath))
    return `${prefix} ${sarifPath}`
  }
}
