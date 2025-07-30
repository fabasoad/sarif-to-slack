import {
  CalculateResultsBy,
  GroupResultsBy,
  LogLevel,
  SarifToSlackService
} from '../../src'

function groupByMap(groupBy?: string): GroupResultsBy {
  switch (groupBy) {
    case 'Tool name': return GroupResultsBy.ToolName
    case 'Run': return GroupResultsBy.Run
    default: return GroupResultsBy.Total
  }
}

function calculateByMap(calculateBy?: string): CalculateResultsBy {
  switch (calculateBy) {
    case 'Level': return CalculateResultsBy.Level
    default: return CalculateResultsBy.Severity
  }
}

describe('(integration): SendSarifToSlack', () => {
  function processLogLevel(logLevel?: string): LogLevel | undefined {
    if (!logLevel) {
      return undefined
    }
    switch (logLevel.toLowerCase()) {
      case 'silly':
        return LogLevel.Silly
      case 'trace':
        return LogLevel.Trace
      case 'debug':
        return LogLevel.Debug
      case 'info':
        return LogLevel.Info
      case 'warning':
        return LogLevel.Warning
      case 'error':
        return LogLevel.Error
      case 'fatal':
        return LogLevel.Fatal
      default:
        throw new Error(`Unknown log level: ${logLevel}`)
    }
  }

  test('Should send Sarif to Slack', async () => {
    const sarifToSlackService: SarifToSlackService = await SarifToSlackService.create({
      webhookUrl: process.env.SARIF_TO_SLACK_WEBHOOK_URL as string,
      username: process.env.SARIF_TO_SLACK_USERNAME,
      iconUrl: process.env.SARIF_TO_SLACK_ICON_URL,
      color: process.env.SARIF_TO_SLACK_COLOR,
      sarifPath: process.env.SARIF_TO_SLACK_SARIF_PATH as string,
      log: {
        level: processLogLevel(process.env.SARIF_TO_SLACK_LOG_LEVEL),
      },
      header: {
        include: process.env.SARIF_TO_SLACK_HEADER !== 'skip',
        value: process.env.SARIF_TO_SLACK_HEADER,
      },
      footer: {
        include: process.env.SARIF_TO_SLACK_FOOTER !== 'skip',
        value: process.env.SARIF_TO_SLACK_FOOTER,
      },
      actor: {
        include: process.env.SARIF_TO_SLACK_ACTOR !== 'skip',
        value: process.env.SARIF_TO_SLACK_ACTOR,
      },
      run: {
        include: Boolean(process.env.SARIF_TO_SLACK_INCLUDE_RUN),
      },
      output: {
        groupBy: groupByMap(process.env.SARIF_TO_SLACK_GROUP_BY),
        calculateBy: calculateByMap(process.env.SARIF_TO_SLACK_CALCULATE_BY),
      }
    })
    await sarifToSlackService.sendAll()
  })
})
