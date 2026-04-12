import { z, ZodSafeParseResult } from 'zod';
import * as stackTraceParser from 'stacktrace-parser';
import { type ILogObj, type ISettingsParam, Logger as TSLogger } from 'tslog';
import { isDebug } from './system';
import { type LoggerOptions, type LogLevel, LogLevelItems } from './types';
import { globalState } from './globalState';

/**
 * Logger class for managing logging operations.
 * @internal
 */
export default class Logger {
  private static DEFAULT_LOG_LEVEL: LogLevel = 'info';
  private static DEFAULT_FUNC_NAME_POSITION: number = 2;

  private readonly _instance: TSLogger<ILogObj>;

  private getMinLevel(minLevel: LogLevel | undefined): number {
    let result: LogLevel = Logger.DEFAULT_LOG_LEVEL;

    if (isDebug()) {
      result = 'silly';
    } else if (minLevel !== undefined) {
      const parseResult: ZodSafeParseResult<LogLevel> = z.enum(LogLevelItems).safeParse(minLevel);
      if (parseResult.success) {
        result = parseResult.data;
      }
    }

    return LogLevelItems.findIndex((v: LogLevel): boolean => v === result);
  }

  private composeLogHeader(
    name: string | undefined,
    logFunctionName: boolean | undefined,
    logFunctionNameOnPosition: number | undefined,
  ): string | undefined {
    let result: string | undefined = name;

    if (logFunctionName === true) {
      const pos: number = logFunctionNameOnPosition ?? Logger.DEFAULT_FUNC_NAME_POSITION;
      if (result === undefined) {
        result = '';
      } else {
        result += '::';
      }
      const stackFrames: stackTraceParser.StackFrame[] = stackTraceParser.parse(
        new Error().stack ?? '',
      );
      if (stackFrames.length > pos) {
        result += stackFrames[pos].methodName;
      }
    }

    return result;
  }

  public constructor(overrides: Partial<LoggerOptions> = {}) {
    const opts: LoggerOptions = {
      ...structuredClone(globalState.loggerOpts ?? {}),
      ...overrides,
    };

    const logName: string | undefined = this.composeLogHeader(
      opts.name, opts.logFunctionName, opts.logFunctionNameOnPosition,
    );
    const settings: ISettingsParam<ILogObj> = {
      minLevel: this.getMinLevel(opts.minLevel),
      name: logName,
      type: 'pretty',
      prettyLogTemplate: opts.prettyLogTemplate || (
        logName === undefined
        ? '[{{logLevelName}}] {{dateIsoStr}} '
        : '[{{logLevelName}}] [{{name}}] {{dateIsoStr}} '
      ),
      prettyLogTimeZone: 'UTC',
      stylePrettyLogs: opts.stylePrettyLogs ?? true,
    };
    this._instance = new TSLogger(settings);
  }

  public info(...args: unknown[]): void {
    this._instance.info(...args);
  }

  public warn(...args: unknown[]): void {
    this._instance.warn(...args);
  }

  public trace(...args: unknown[]): void {
    this._instance.trace(...args);
  }

  public debug(...args: unknown[]): void {
    this._instance.debug(...args);
  }
}
