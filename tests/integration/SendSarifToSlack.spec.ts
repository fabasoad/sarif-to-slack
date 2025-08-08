import { LogLevel, RepresentationType, SarifToSlackService } from '../../src'

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

  function processRepresentationType(representation?: string): RepresentationType | undefined {
    if (representation == null) {
      return undefined
    }

    switch (representation.toLowerCase()) {
      case 'compact-group-by-run-per-level':
        return RepresentationType.CompactGroupByRunPerLevel
      case 'compact-group-by-run-per-severity':
        return RepresentationType.CompactGroupByRunPerSeverity
      case 'compact-group-by-tool-name-per-level':
        return RepresentationType.CompactGroupByToolNamePerLevel
      case 'compact-group-by-tool-name-per-severity':
        return RepresentationType.CompactGroupByToolNamePerSeverity
      case 'compact-group-by-sarif-per-level':
        return RepresentationType.CompactGroupBySarifPerLevel
      case 'compact-group-by-sarif-per-severity':
        return RepresentationType.CompactGroupBySarifPerSeverity
      case 'compact-total-per-level':
        return RepresentationType.CompactTotalPerLevel
      case 'compact-total-per-severity':
        return RepresentationType.CompactTotalPerSeverity
      default:
        return undefined
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
      representation: processRepresentationType(process.env.SARIF_TO_SLACK_REPRESENTATION),
    })
    await sarifToSlackService.send()
  })
})
