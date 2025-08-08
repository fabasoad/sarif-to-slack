import type { Result, Run, ToolComponent } from 'sarif'

export function findToolComponentDriver(run: Run): ToolComponent {
  return run.tool.driver
}

export function tryFindToolComponentExtension(run: Run, result: Result): ToolComponent | undefined {
  let tool: ToolComponent | undefined
  if (result.rule?.toolComponent?.index != null) {
    tool = run.tool.extensions?.[result.rule.toolComponent.index]
  }
  return tool
}

export function findToolComponent(run: Run, result: Result): ToolComponent {
  return tryFindToolComponentExtension(run, result) ?? findToolComponentDriver(run)
}
