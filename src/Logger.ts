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
  private static instance: TSLogger<ILogObj> = new TSLogger();

  public static initialize({ logLevel = LogLevel.Info }: LoggerOptions): void {
    if (!Logger.instance) {
      Logger.instance = new TSLogger({
        minLevel: process.env.ACTIONS_STEP_DEBUG === 'true' ? 0 : logLevel,
        type: 'pretty',
        prettyLogTimeZone: 'UTC',
      })
    }
  }

  public static warn(...args: string[]): void {
    Logger.instance.warn(args)
  }

  public static info(...args: string[]): void {
    Logger.instance.info(args)
  }

  public static debug(...args: string[]): void {
    Logger.instance.debug(args)
  }
}
