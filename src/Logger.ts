import { ILogObj, Logger as TSLogger } from 'tslog'
import { LogLevel, LogOptions } from './types'

/**
 * Logger class for managing logging operations.
 * @internal
 */
export default class Logger {
  private static DEFAULT_LOG_LEVEL: LogLevel = LogLevel.Info
  private static DEFAULT_LOG_TEMPLATE: string = '[{{logLevelName}}] [{{name}}] {{dateIsoStr}} '
  private static DEFAULT_LOG_COLORED: boolean = true

  private static instance: TSLogger<ILogObj>

  public static initialize(opts?: LogOptions): void {
    if (!Logger.instance) {
      Logger.instance = new TSLogger({
        name: '@fabasoad/sarif-to-slack',
        minLevel: process.env.ACTIONS_STEP_DEBUG === 'true' ? LogLevel.Silly : (opts?.level ?? Logger.DEFAULT_LOG_LEVEL),
        type: 'pretty',
        prettyLogTimeZone: 'UTC',
        prettyLogTemplate: opts?.template ?? Logger.DEFAULT_LOG_TEMPLATE,
        stylePrettyLogs: opts?.colored ?? Logger.DEFAULT_LOG_COLORED,
      })
    }
  }

  public static warn(...args: unknown[]): void {
    Logger.instance.warn(...args)
  }

  public static info(...args: unknown[]): void {
    Logger.instance.info(...args)
  }

  public static debug(...args: unknown[]): void {
    Logger.instance.debug(...args)
  }

  public static trace(...args: unknown[]): void {
    Logger.instance.trace(...args)
  }
}
