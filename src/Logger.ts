import { type ILogObj, Logger as TSLogger } from 'tslog'
import { z, type ZodSafeParseResult } from 'zod';
import { isDebug } from './system';

/**
 * In ascending order: silly, trace, debug, info, warning, error, fatal.
 */
type LogLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Logger class for managing logging operations.
 * @internal
 */
export default class Logger {
  private static APP_NAME: string = '@fabasoad/sarif-to-slack';
  private static DEFAULT_LOG_LEVEL: LogLevel = 3;
  private static DEFAULT_LOG_TEMPLATE: string = '[{{logLevelName}}] [{{name}}] {{dateIsoStr}} ';
  private static DEFAULT_LOG_COLORED: boolean = true;

  private readonly _instance: TSLogger<ILogObj>;

  private getLogLevel(): LogLevel {
    if (isDebug()) {
      return 0;
    }

    const result: ZodSafeParseResult<LogLevel> = z.string()
      .transform(Number)
      .refine((v: number): boolean => !Number.isNaN(v))
      .refine((v: number): boolean => v >= 0 && v < 7)
      .transform((v: number): LogLevel => v as LogLevel)
      .safeParse(process.env.SARIF_TO_SLACK_LOG_LEVEL);
    if (result.success) {
      return result.data;
    }

    return Logger.DEFAULT_LOG_LEVEL;
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
      minLevel: this.getLogLevel(),
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
