import { CommonProcessor } from './CommonProcessor'
import type { Result, Run, ToolComponent } from 'sarif'
import { findToolComponent } from '../utils/SarifUtils'
import { SnykProcessor } from './SnykProcessor'
import { CodeQLProcessor } from './CodeQLProcessor'

export function createProcessor(run: Run, result: Result): CommonProcessor {
  const toolComponent: ToolComponent = findToolComponent(run, result)
  switch (toolComponent.name) {
    case 'CodeQL': return new CodeQLProcessor(run, result)
    case 'Snyk Open Source': return new SnykProcessor(run, result)
    default: return new CommonProcessor(run, result)
  }
}
