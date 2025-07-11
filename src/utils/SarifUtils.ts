import type { ReportingDescriptor, Result, Run } from "sarif";

type RuleData = { id?: string, index?: number }

export function tryGetRulePropertyByResult<T>(run: Run, result: Result, propertyName: string): T | undefined {
  const ruleData: RuleData = {}

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
    const rule: ReportingDescriptor = run.tool.driver.rules[ruleData.index]
    if (rule.properties && propertyName in rule.properties) {
      return rule.properties[propertyName] as T
    }
  }

  return undefined
}
