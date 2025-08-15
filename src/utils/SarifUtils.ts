import type { Result, Run, ToolComponent } from 'sarif'

/**
 * Returns {@link ToolComponent} instance for the given {@link Run}. It does not
 * count extensions but returns {@link ToolComponent} directly from "run.tool.driver",
 * despite the fact if extension exists or not.
 * @internal
 */
export function findToolComponentDriver(run: Run): ToolComponent {
  return run.tool.driver
}

/**
 * Returns {@link ToolComponent} instance for the given {@link Run} from the extensions
 * list if applicable. Returns {@linkcode undefined} if provided {@link Result}
 * does not link to extension.
 * @internal
 */
export function tryFindToolComponentExtension(run: Run, result: Result): ToolComponent | undefined {
  let tool: ToolComponent | undefined
  if (result.rule?.toolComponent?.index != null) {
    tool = run.tool.extensions?.[result.rule.toolComponent.index]
  }
  return tool
}

/**
 * It tries to find respective {@link ToolComponent} from the {@link Result}. At
 * first, it tries to find it in the list of extensions if applicable, otherwise
 * it gets it directly from "run.tool.driver".
 * @internal
 */
export function findToolComponent(run: Run, result: Result): ToolComponent {
  return tryFindToolComponentExtension(run, result) ?? findToolComponentDriver(run)
}
