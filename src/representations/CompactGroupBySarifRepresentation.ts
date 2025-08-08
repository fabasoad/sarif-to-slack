import { Finding } from '../model/Finding'
import CompactGroupByRepresentation from './CompactGroupByRepresentation'

export default abstract class CompactGroupBySarifRepresentation extends CompactGroupByRepresentation {

  public constructor(findings: Finding[]) {
    super(findings, 'sarifPath')
  }

  protected override composeGroupTitle(f: Finding, index: number): string {
    const prefix: string = this.italic(`[File ${index + 1}]`)
    const sarifPath: string = this.bold(f.sarifPath)
    return `${prefix} ${sarifPath}`
  }
}
