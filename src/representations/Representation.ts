import { SarifModel } from '../types'
import { Finding } from '../model/Finding'
import { findingsComparatorByKey } from '../utils/Comparators'

export default abstract class Representation {
  protected readonly _model: SarifModel

  public constructor(model: SarifModel, findingSortKey: keyof Finding = 'level') {
    this._model = model
    this._model.findings = model
      .findings
      .map((f: Finding): Finding => f.clone())
      .sort(findingsComparatorByKey(findingSortKey))
  }

  protected bold(text: string): string {
    return `*${text}*`
  }

  protected italic(text: string): string {
    return `_${text}_`
  }

  abstract compose(): string
}
