import { Finding } from '../model/Finding'
import CompactGroupByRepresentation from './CompactGroupByRepresentation';

export default abstract class CompactGroupByToolNameRepresentation extends CompactGroupByRepresentation {

  public constructor(findings: Finding[]) {
    super(findings, 'toolName')
  }

  protected override composeGroupTitle(f: Finding): string {
    return this.bold(f.toolName);
  }
}
