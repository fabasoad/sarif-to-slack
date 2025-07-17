import { Logger as TSLogger, ILogObj } from 'tslog'
import { LogLevel } from './types'

/**
 * Logger options for configuring the logging behavior.
 * @internal
 */
export type LoggerOptions = {
  logLevel?: LogLevel
}

/**
 * Logger class for managing logging operations.
 * @internal
 */
export default class Logger {
  private static instance: TSLogger<ILogObj>

  public static initialize({ logLevel = LogLevel.Info }: LoggerOptions): void {
    if (!Logger.instance) {
      Logger.instance = new TSLogger({
        name: 'sarif-to-slack',
        minLevel: process.env.ACTIONS_STEP_DEBUG === 'true' ? 0 : logLevel,
        type: 'pretty',
        prettyLogTimeZone: 'UTC',
        prettyLogTemplate: '[{{name}}] {{dateIsoStr}} level={{logLevelName}} '
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
}
