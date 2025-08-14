import type { ReportingDescriptor, Result, Run, ToolComponent } from 'sarif'
import * as sarifUtils from '../utils/SarifUtils'

/**
 * This class has logic of the SARIF file processing, such as finding rule,
 * finding tool component, etc. It is used by default for all SARIF files.
 * Derived classes from this class can implement extra logic for the specific
 * use cases, such as SARIF files produced by specific tools. For example,
 * {@link CodeQLProcessor} handles additional logic for processing SARIF files
 * produced by CodeQL.
 * @internal
 */
export class CommonProcessor {
  protected readonly _run: Run
  protected readonly _result: Result

  /**
   * Creates an instance of {@link CommonProcessor} class.
   * @param run An instance of {@link Run} object.
   * @param result An instance of {@link Result} object.
   */
  public constructor(run: Run, result: Result) {
    this._run = run
    this._result = result
  }

  public tryFindCvssScore(): number | undefined {
    return this.tryFindRuleProperty('security-severity')
  }

  public tryFindLevel(): Result.level | undefined {
    return this._result.level ?? this.tryFindRule()?.defaultConfiguration?.level
  }

  public findToolComponentDriver(): ToolComponent {
    return sarifUtils.findToolComponentDriver(this._run)
  }

  public tryFindToolComponentExtension(): ToolComponent | undefined {
    return sarifUtils.tryFindToolComponentExtension(this._run, this._result)
  }

  public findToolComponent(): ToolComponent {
    return sarifUtils.findToolComponent(this._run, this._result)
  }

  /**
   * This function tries to find the respective rule for the given result.
   * @internal
   */
  public tryFindRule(): ReportingDescriptor | undefined {
    const ruleData: { id?: string, index?: number } = {}

    if (this._result.rule) {
      if (this._result.rule?.index != null) {
        ruleData.index = this._result.rule.index
      }
      if (this._result.rule?.id) {
        ruleData.id = this._result.rule.id
      }
    }

    if (ruleData.index == null && this._result.ruleIndex != null) {
      ruleData.index = this._result.ruleIndex
    }

    if (!ruleData.id && this._result.ruleId) {
      ruleData.id = this._result.ruleId
    }

    const tool: ToolComponent = this.findToolComponent()

    if (ruleData.index != null
      && tool?.rules
      && ruleData.index < tool.rules.length) {
      return tool.rules[ruleData.index]
    }

    // If failed to find rule by index then try to find by ruleId
    if (ruleData.id && tool?.rules) {
      return tool.rules.find(
        (r: ReportingDescriptor): boolean => r.id === ruleData.id
      )
    }

    return undefined
  }

  /**
   * This function searches respective rule for the given result, and then gets
   * the property of interest from it.
   * @param propertyName The property name that you want to get the value from.
   * @protected
   */
  protected tryFindRuleProperty<T>(propertyName: string): T | undefined {
    const rule: ReportingDescriptor | undefined = this.tryFindRule()
    if (rule?.properties && propertyName in rule.properties) {
      return rule.properties[propertyName] as T
    }

    return undefined
  }
}
