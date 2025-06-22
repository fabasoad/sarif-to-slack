import * as fs from 'fs'
import * as path from 'path'
import Logger from './Logger'
import { LogLevel } from './types'

/**
 * Processes a color string and converts it to a specific hex code if it matches
 * a CI status identifier.
 * @param color - The color string to process, which can be a CI status identifier
 * or a custom color.
 * @returns The processed color as a hex string or undefined if the input is not
 * a recognized CI status identifier.
 * @internal
 */
export function processColor(color?: string): string | undefined {
  switch (color) {
    case 'success':
      Logger.info(`Converting "${color}" to #008000`)
      return '#008000'
    case 'failure':
      Logger.info(`Converting "${color}" to #ff0000`)
      return '#ff0000'
    case 'cancelled':
      Logger.info(`Converting "${color}" to #0047ab`)
      return '#0047ab'
    case 'skipped':
      Logger.info(`Converting "${color}" to #808080`)
      return '#808080'
    default:
      Logger.debug(`"${color}" color is not a CI status identifier. Returning as is...`)
      return color
  }
}

/**
 * Processes a log level string or number and converts it to a numeric log level.
 * @param logLevel
 * @returns The numeric log level corresponding to the input string or number.
 * @throws Error If the input string does not match any known log level.
 * @internal
 */
export function processLogLevel(logLevel?: LogLevel | string): LogLevel | undefined {
  if (typeof logLevel === 'string') {
    switch (logLevel.toLowerCase()) {
      case 'silly':
        return 0
      case 'trace':
        return 1
      case 'debug':
        return 2
      case 'info':
        return 3
      case 'warning':
        return 4
      case 'error':
        return 5
      case 'fatal':
        return 6
      default:
        throw new Error(`Unknown log level: ${logLevel}`)
    }
  }
  return logLevel
}

/**
 * Processes the SARIF path, which can be a file or a directory. If it's a
 * directory, it returns an array of paths to all `.sarif` files, otherwise it
 * returns an array with a single path to the file.
 * @param sarifPath - The path to the SARIF file or directory.
 * @returns An array of strings representing the paths to the SARIF files.
 * @throws Error If the path does not exist, or if it is neither a file nor a
 * directory.
 * @internal
 */
export function processSarifPath(sarifPath: string): string[] {
  if (!fs.existsSync(sarifPath)) {
    throw new Error(`"sarif-path" does not exist: ${sarifPath}`)
  }

  const sarifStats: fs.Stats = fs.statSync(sarifPath)

  if (sarifStats.isDirectory()) {
    Logger.info(`"sarif-path" is a directory: ${sarifPath}`)
    const files: string[] = fs.readdirSync(sarifPath)
    const filteredFiles: string[] = files.filter((file: string) =>
      path.extname(file).toLowerCase() === '.sarif'
    )
    Logger.info(`Found ${filteredFiles.length} SARIF files in ${sarifPath} directory`)
    Logger.debug(`Filtered SARIF files: ${filteredFiles.join(', ')}`)
    return filteredFiles.map((file: string) => path.join(sarifPath, file))
  }

  if (sarifStats.isFile()) {
    Logger.info(`"sarif-path" is a file: ${sarifPath}`)
    return [sarifPath]
  }

  throw new Error(`"sarif-path" is neither a file nor a directory: ${sarifPath}`)
}
