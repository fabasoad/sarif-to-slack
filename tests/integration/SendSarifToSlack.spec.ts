import { z, ZodSafeParseResult } from 'zod';
import {
  Color,
  LogLevel,
  LogLevelItems,
  RepresentationType,
  SarifFileExtensionItems,
  SarifToSlackClient,
  SendIf,
} from '../../src';

describe('(integration): SendSarifToSlack', (): void => {
  function processRepresentationType(representation?: string): RepresentationType | undefined {
    if (representation == null) {
      return undefined;
    }

    switch (representation.toLowerCase()) {
      case 'compact-group-by-run-per-level':
        return RepresentationType.CompactGroupByRunPerLevel;
      case 'compact-group-by-run-per-severity':
        return RepresentationType.CompactGroupByRunPerSeverity;
      case 'compact-group-by-tool-name-per-level':
        return RepresentationType.CompactGroupByToolNamePerLevel;
      case 'compact-group-by-tool-name-per-severity':
        return RepresentationType.CompactGroupByToolNamePerSeverity;
      case 'compact-group-by-sarif-per-level':
        return RepresentationType.CompactGroupBySarifPerLevel;
      case 'compact-group-by-sarif-per-severity':
        return RepresentationType.CompactGroupBySarifPerSeverity;
      case 'compact-total-per-level':
        return RepresentationType.CompactTotalPerLevel;
      case 'compact-total-per-severity':
        return RepresentationType.CompactTotalPerSeverity;
      case 'table-group-by-run-per-level':
        return RepresentationType.TableGroupByRunPerLevel;
      case 'table-group-by-run-per-severity':
        return RepresentationType.TableGroupByRunPerSeverity;
      case 'table-group-by-tool-name-per-level':
        return RepresentationType.TableGroupByToolNamePerLevel;
      case 'table-group-by-tool-name-per-severity':
        return RepresentationType.TableGroupByToolNamePerSeverity;
      case 'table-group-by-sarif-per-level':
        return RepresentationType.TableGroupBySarifPerLevel;
      case 'table-group-by-sarif-per-severity':
        return RepresentationType.TableGroupBySarifPerSeverity;
      default:
        return undefined;
    }
  }

  function processSendIf(sendIf?: string): SendIf | undefined {
    if (sendIf == null) {
      return undefined;
    }

    switch (sendIf.toLowerCase()) {
      case 'severity-critical': return SendIf.SeverityCritical;
      case 'severity-high': return SendIf.SeverityHigh;
      case 'severity-high-or-higher': return SendIf.SeverityHighOrHigher;
      case 'severity-medium': return SendIf.SeverityMedium;
      case 'severity-medium-or-higher': return SendIf.SeverityMediumOrHigher;
      case 'severity-low': return SendIf.SeverityLow;
      case 'severity-low-or-higher': return SendIf.SeverityLowOrHigher;
      case 'severity-none': return SendIf.SeverityNone;
      case 'severity-none-or-higher': return SendIf.SeverityNoneOrHigher;
      case 'severity-unknown': return SendIf.SeverityUnknown;
      case 'severity-unknown-or-higher': return SendIf.SeverityUnknownOrHigher;
      case 'level-error': return SendIf.LevelError;
      case 'level-warning': return SendIf.LevelWarning;
      case 'level-warning-or-higher': return SendIf.LevelWarningOrHigher;
      case 'level-note': return SendIf.LevelNote;
      case 'level-note-or-higher': return SendIf.LevelNoteOrHigher;
      case 'level-none': return SendIf.LevelNone;
      case 'level-none-or-higher': return SendIf.LevelNoneOrHigher;
      case 'level-unknown': return SendIf.LevelUnknown;
      case 'level-unknown-or-higher': return SendIf.LevelUnknownOrHigher;
      case 'always': return SendIf.Always;
      case 'some': return SendIf.Some;
      case 'empty': return SendIf.Empty;
      case 'never': return SendIf.Never;
      default: return undefined;
    }
  }

  test('should send Sarif to Slack', async () => {
    const parseBoolean = <T>(envVar: string | undefined, defaultVal: T): boolean | T => {
      const parseResult: ZodSafeParseResult<boolean> = z
        .string()
        .transform((val: string): string => val.toLowerCase())
        .refine((val: string): val is "true" | "false" => val === "true" || val === "false")
        .transform((val: "true" | "false"): val is "true" => val === "true")
        .safeParse(envVar);
      return parseResult.success ? parseResult.data : defaultVal;
    }

    const logLevelParseResult: ZodSafeParseResult<LogLevel> =
      z.enum(LogLevelItems).safeParse(process.env.SARIF_TO_SLACK_LOG_LEVEL);
    const logFunctionNameOnPositionParseResult: ZodSafeParseResult<number> =
      z.coerce.number().safeParse(process.env.SARIF_TO_SLACK_LOG_FUNCTION_NAME_ON_POSITION);

    const client: SarifToSlackClient = await SarifToSlackClient.create(
      process.env.SARIF_TO_SLACK_WEBHOOK_URL as string,
      {
        username: process.env.SARIF_TO_SLACK_USERNAME,
        iconUrl: process.env.SARIF_TO_SLACK_ICON_URL,
        color: {
          default: Color.from(process.env.SARIF_TO_SLACK_COLOR),
          empty: Color.from(process.env.SARIF_TO_SLACK_COLOR_EMPTY),
          byLevel: {
            error: Color.from(process.env.SARIF_TO_SLACK_COLOR_ERROR),
            warning: Color.from(process.env.SARIF_TO_SLACK_COLOR_WARNING),
            note: Color.from(process.env.SARIF_TO_SLACK_COLOR_NOTE),
            none: Color.from(process.env.SARIF_TO_SLACK_COLOR_NONE),
            unknown: Color.from(process.env.SARIF_TO_SLACK_COLOR_UNKNOWN),
          },
          bySeverity: {
            critical: Color.from(process.env.SARIF_TO_SLACK_COLOR_CRITICAL),
            high: Color.from(process.env.SARIF_TO_SLACK_COLOR_HIGH),
            medium: Color.from(process.env.SARIF_TO_SLACK_COLOR_MEDIUM),
            low: Color.from(process.env.SARIF_TO_SLACK_COLOR_LOW),
            none: Color.from(process.env.SARIF_TO_SLACK_COLOR_NONE),
            unknown: Color.from(process.env.SARIF_TO_SLACK_COLOR_UNKNOWN),
          },
        },
        sarif: {
          path: process.env.SARIF_TO_SLACK_SARIF_PATH as string,
          recursive: parseBoolean(process.env.SARIF_TO_SLACK_SARIF_PATH_RECURSIVE, false),
          extension: z.enum(SarifFileExtensionItems).parse(process.env.SARIF_TO_SLACK_SARIF_FILE_EXTENSION),
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
          include: parseBoolean(process.env.SARIF_TO_SLACK_INCLUDE_RUN, false),
        },
        representation: processRepresentationType(process.env.SARIF_TO_SLACK_REPRESENTATION),
        sendIf: processSendIf(process.env.SARIF_TO_SLACK_SEND_IF),
        loggerOptions: {
          logFunctionName: parseBoolean(process.env.SARIF_TO_SLACK_LOG_FUNCTION_NAME, undefined),
          logFunctionNameOnPosition: logFunctionNameOnPositionParseResult.success ? logFunctionNameOnPositionParseResult.data : undefined,
          minLevel: logLevelParseResult.success ? logLevelParseResult.data : undefined,
          name: 'integration-test',
          stylePrettyLogs: parseBoolean(process.env.SARIF_TO_SLACK_STYLE_PRETTY_LOGS, undefined),
          prettyLogTemplate: process.env.SARIF_TO_SLACK_LOG_TEMPLATE,
        },
      },
    );
    await client.send();
  })
})
