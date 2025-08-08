import { Finding } from '../model/Finding'

export default abstract class Representation {
  protected readonly _findings: Finding[] = []

  protected constructor(findings: Finding[]) {
    this._findings = findings
  }

  protected bold(text: string): string {
    return `*${text}*`
  }

  protected italic(text: string): string {
    return `_${text}_`
  }

  abstract compose(): string
}
