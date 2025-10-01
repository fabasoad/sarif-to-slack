import { type ILogObj, Logger as TSLogger } from 'tslog'
import { z, type ZodSafeParseResult } from 'zod';
import { isDebug } from './system';

const LogLevelItems = ['silly', 'trace', 'debug', 'info', 'warning', 'error', 'fatal'] as const;
type LogLevel = (typeof LogLevelItems)[number];

/**
 * Logger class for managing logging operations.
 * @internal
 */
export default class Logger {
  private static APP_NAME: string = '@fabasoad/sarif-to-slack';
  private static DEFAULT_LOG_LEVEL: LogLevel = 'info';
  private static DEFAULT_LOG_TEMPLATE: string = '[{{logLevelName}}] [{{name}}] {{dateIsoStr}} ';
  private static DEFAULT_LOG_COLORED: boolean = true;

  private readonly _instance: TSLogger<ILogObj>;

  private isLogLevel(v: string): v is LogLevel {
    return (LogLevelItems as ReadonlyArray<string>).includes(v);
  }

  private getMinLevel(): number {
    let result: LogLevel = Logger.DEFAULT_LOG_LEVEL;

    if (isDebug()) {
      result = 'silly';
    } else {
      const parseResult: ZodSafeParseResult<LogLevel> = z
        .string()
        .refine((v: string): boolean => this.isLogLevel(v))
        .transform((v: string): LogLevel => v as LogLevel)
        .safeParse(process.env.SARIF_TO_SLACK_LOG_LEVEL);
      if (parseResult.success) {
        result = parseResult.data;
      }
    }

    return LogLevelItems.findIndex((v: LogLevel): boolean => v === result);
  }

  private getLogTemplate(): string {
    const result: ZodSafeParseResult<string> =
      z.string().safeParse(process.env.SARIF_TO_SLACK_LOG_TEMPLATE);
    return result.success ? result.data : Logger.DEFAULT_LOG_TEMPLATE;
  }

  private getLogColored(): boolean {
    const result: ZodSafeParseResult<boolean> =
      z.stringbool().safeParse(process.env.SARIF_TO_SLACK_LOG_COLORED);
    return result.success ? result.data : Logger.DEFAULT_LOG_COLORED;
  }

  public constructor(memberName?: string) {
    this._instance = new TSLogger({
      name: `${Logger.APP_NAME}${memberName === undefined ? '' : `::${memberName}`}`,
      minLevel: this.getMinLevel(),
      type: 'pretty',
      prettyLogTimeZone: 'UTC',
      prettyLogTemplate: this.getLogTemplate(),
      stylePrettyLogs: this.getLogColored(),
    })
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
