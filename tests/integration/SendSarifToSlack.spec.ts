import {
  Color,
  LogLevel,
  RepresentationType,
  SarifToSlackClient,
  SendIf
} from '../../src'

describe('(integration): SendSarifToSlack', (): void => {
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

  function processSendIf(sendIf?: string): SendIf | undefined {
    if (sendIf == null) {
      return undefined
    }

    switch (sendIf.toLowerCase()) {
      case 'severity-critical': return SendIf.SeverityCritical
      case 'severity-high': return SendIf.SeverityHigh
      case 'severity-high-or-higher': return SendIf.SeverityHighOrHigher
      case 'severity-medium': return SendIf.SeverityMedium
      case 'severity-medium-or-higher': return SendIf.SeverityMediumOrHigher
      case 'severity-low': return SendIf.SeverityLow
      case 'severity-low-or-higher': return SendIf.SeverityLowOrHigher
      case 'severity-none': return SendIf.SeverityNone
      case 'severity-none-or-higher': return SendIf.SeverityNoneOrHigher
      case 'severity-unknown': return SendIf.SeverityUnknown
      case 'severity-unknown-or-higher': return SendIf.SeverityUnknownOrHigher
      case 'level-error': return SendIf.LevelError
      case 'level-warning': return SendIf.LevelWarning
      case 'level-warning-or-higher': return SendIf.LevelWarningOrHigher
      case 'level-note': return SendIf.LevelNote
      case 'level-note-or-higher': return SendIf.LevelNoteOrHigher
      case 'level-none': return SendIf.LevelNone
      case 'level-none-or-higher': return SendIf.LevelNoneOrHigher
      case 'level-unknown': return SendIf.LevelUnknown
      case 'level-unknown-or-higher': return SendIf.LevelUnknownOrHigher
      case 'always': return SendIf.Always
      case 'some': return SendIf.Some
      case 'empty': return SendIf.Empty
      case 'never': return SendIf.Never
      default: return undefined
    }
  }

  test('Should send Sarif to Slack', async () => {
    const client: SarifToSlackClient = await SarifToSlackClient.create({
      webhookUrl: process.env.SARIF_TO_SLACK_WEBHOOK_URL as string,
      username: process.env.SARIF_TO_SLACK_USERNAME,
      iconUrl: process.env.SARIF_TO_SLACK_ICON_URL,
      color: {
        default: new Color(process.env.SARIF_TO_SLACK_COLOR),
        byLevel: {
          error: new Color(process.env.SARIF_TO_SLACK_COLOR_ERROR),
          warning: new Color(process.env.SARIF_TO_SLACK_COLOR_WARNING),
          note: new Color(process.env.SARIF_TO_SLACK_COLOR_NOTE),
          none: new Color(process.env.SARIF_TO_SLACK_COLOR_NONE),
          unknown: new Color(process.env.SARIF_TO_SLACK_COLOR_UNKNOWN),
        },
        bySeverity: {
          critical: new Color(process.env.SARIF_TO_SLACK_COLOR_CRITICAL),
          high: new Color(process.env.SARIF_TO_SLACK_COLOR_HIGH),
          medium: new Color(process.env.SARIF_TO_SLACK_COLOR_MEDIUM),
          low: new Color(process.env.SARIF_TO_SLACK_COLOR_LOW),
          none: new Color(process.env.SARIF_TO_SLACK_COLOR_NONE),
          unknown: new Color(process.env.SARIF_TO_SLACK_COLOR_UNKNOWN),
        },
        empty: new Color(process.env.SARIF_TO_SLACK_COLOR_EMPTY),
      },
      sarif: {
        path: process.env.SARIF_TO_SLACK_SARIF_PATH as string,
        recursive: true,
        extension: 'sarif',
      },
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
      sendIf: processSendIf(process.env.SARIF_TO_SLACK_SEND_IF),
    })
    await client.send()
  })
})
