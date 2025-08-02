import { Finding } from '../model/Finding'

export default abstract class Representation {
  protected readonly _findings: Finding[] = []

  public constructor(findings: Finding[]) {
    this._findings = findings
  }

  abstract compose(): string
}
