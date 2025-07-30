import type { ReportingDescriptor, Result, Run, ToolComponent } from "sarif";

/**
 * This function finds the respective tool for the given result.
 * @param run An instance of {@link Run} object.
 * @param result An instance of {@link Result} object.
 * @private
 */
function findToolComponentByResult(run: Run, result: Result): ToolComponent {
  let tool: ToolComponent | undefined
  if (result.rule?.toolComponent?.index != null) {
    tool = run.tool.extensions?.[result.rule.toolComponent.index]
  }

  if (!tool) {
    tool = run.tool.driver
  }

  return tool
}

/**
 * This function tries to find the respective rule for the given result.
 * @param run An instance of {@link Run} object.
 * @param result An instance of {@link Result} object.
 * @internal
 */
export function findRuleByResult(run: Run, result: Result): ReportingDescriptor | undefined {
  const ruleData: { id?: string, index?: number } = {}

  if (result.rule) {
    if (result.rule?.index != null) {
      ruleData.index = result.rule.index
    }
    if (result.rule?.id) {
      ruleData.id = result.rule.id
    }
  }

  if (ruleData.index == null && result.ruleIndex != null) {
    ruleData.index = result.ruleIndex
  }

  if (!ruleData.id && result.ruleId) {
    ruleData.id = result.ruleId
  }

  const tool: ToolComponent = findToolComponentByResult(run, result)

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
 * Allowed property names that we can search for from the rule.
 * @internal
 */
export type RuleProperty = 'security-severity' | 'problem.severity'

/**
 * This function searches respective rule for the given result, and then gets
 * the property of interest from it.
 * @param run An instance of {@link Run} object.
 * @param result An instance of {@link Result} object.
 * @param propertyName The property name that you want to get the value from.
 * @internal
 */
export function tryGetRulePropertyByResult<T>(run: Run, result: Result, propertyName: RuleProperty): T | undefined {
  const rule: ReportingDescriptor | undefined = findRuleByResult(run, result)
  if (rule && rule.properties && propertyName in rule.properties) {
    return rule.properties[propertyName] as T
  }

  return undefined
}
