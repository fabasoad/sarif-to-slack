import fs from 'fs'
import Logger from '../Logger'
import { SarifFileExtension, SarifOptions } from '../types'
import * as path from 'path'

/**
 * Traverse directory recursively and returns list of files with the requested
 * extension.
 * @param dir A root directory. Starting point.
 * @param extension An instance of {@link SarifFileExtension} type.
 * @param fileList Collected list of files.
 * @private
 */
function listFilesRecursively(
  dir: string,
  extension: SarifFileExtension,
  fileList: string[] = []
): string[] {
  const entries: string[] = fs.readdirSync(dir)
  entries.forEach((entry: string): void => {
    const fullPath: string = path.join(dir, entry)
    if (fs.statSync(fullPath).isDirectory()) {
      listFilesRecursively(fullPath, extension, fileList)
    } else if (path.extname(fullPath).toLowerCase() === `.${extension}`) {
      fileList.push(fullPath)
    }
  })
  return fileList
}

/**
 * Extract list of files based on the parameters from the given {@link SarifOptions}
 * object.
 * @param opts An instance of {@link SarifOptions} type.
 * @internal
 */
export function extractListOfFiles(opts: SarifOptions): string[] {
  if (!fs.existsSync(opts.path)) {
    throw new Error(`Provided path does not exist: ${opts.path}`)
  }

  const stats: fs.Stats = fs.statSync(opts.path)

  if (stats.isDirectory()) {
    Logger.info(`Provided path is a directory: ${opts.path}`)
    const files: string[] = opts.recursive
      && listFilesRecursively(opts.path, opts.extension ?? 'sarif')
      || fs.readdirSync(opts.path)
    Logger.info(`Found ${files.length} files in ${opts.path} directory with ${opts.extension} extension`)
    Logger.debug(`Found files: ${files.join(', ')}`)
    return files
  }

  if (stats.isFile()) {
    Logger.info(`Provided path is a file: ${opts.path}`)
    return [opts.path]
  }

  throw new Error(`Provided path is neither a file nor a directory: ${opts.path}`)
}
