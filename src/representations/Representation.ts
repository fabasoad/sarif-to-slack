import type { SarifModel } from '../types';
import type Finding from '../model/Finding';
import FindingArray from '../model/FindingArray';
import { findingsComparatorByKey } from '../utils/Comparators';

/**
 * The most base abstract class for the representation. Every representation class
 * must be derived from this class implicitly or explicitly.
 * @internal
 */
export default abstract class Representation {
  protected readonly _model: SarifModel

  public constructor(model: SarifModel, findingSortKey: keyof Finding = 'level') {
    this._model = model
    this._model.findings = model
      .findings
      .map((f: Finding): Finding => f.clone())
      .sort(findingsComparatorByKey(findingSortKey))
      .reduce((arr: FindingArray, f: Finding): FindingArray => {
        arr.push(f)
        return arr
      }, new FindingArray())
  }

  protected bold(text: string): string {
    return `*${text}*`
  }

  protected italic(text: string): string {
    return `_${text}_`
  }

  protected codeBlock(text: string): string {
    // biome-ignore lint/style/useTemplate: Template literals are unreadable here
    return '```\n' + text + '\n```'
  }

  abstract compose(): string
}
