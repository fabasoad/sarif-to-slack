import type { ReportingDescriptor, Result, Run } from "sarif";

export function findRuleByResult(run: Run, result: Result): ReportingDescriptor | undefined {
  const ruleData: { id?: string, index?: number } = {}

  if (result.rule) {
    if (result.rule?.index) {
      ruleData.index = result.rule.index
    }
    if (result.rule?.id) {
      ruleData.id = result.rule.id
    }
  }

  if (!ruleData.index && result.ruleIndex) {
    ruleData.index = result.ruleIndex
  }

  if (ruleData.index
    && run.tool.driver?.rules
    && ruleData.index < run.tool.driver.rules.length) {
    return run.tool.driver.rules[ruleData.index]
  }

  // If failed to find rule by index then try to find by ruleId
  if (result.ruleId && run.tool.driver?.rules) {
    return run.tool.driver.rules.find(
      (r: ReportingDescriptor): boolean => r.id === result.ruleId
    )
  }

  return undefined
}

export type RuleProperty = 'security-severity' | 'problem.severity'

export function tryGetRulePropertyByResult<T>(run: Run, result: Result, propertyName: RuleProperty): T | undefined {
  const rule: ReportingDescriptor | undefined = findRuleByResult(run, result)
  if (rule && rule.properties && propertyName in rule.properties) {
    return rule.properties[propertyName] as T
  }

  return undefined
}
