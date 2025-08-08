import fs from 'fs'
import Logger from '../Logger'
import { extname as pathExtname, join as pathJoin } from 'path'

export function extractListOfFiles(path: string, extension: 'sarif' = 'sarif'): string[] {
  if (!fs.existsSync(path)) {
    throw new Error(`Provided path does not exist: ${path}`)
  }

  const stats: fs.Stats = fs.statSync(path)

  if (stats.isDirectory()) {
    Logger.info(`Provided path is a directory: ${path}`)
    const files: string[] = fs.readdirSync(path)
    const filteredFiles: string[] = files.filter((file: string): boolean =>
      pathExtname(file).toLowerCase() === `.${extension}`
    )
    Logger.info(`Found ${filteredFiles.length} files in ${path} directory with ${extension} extension`)
    Logger.debug(`Found files: ${filteredFiles.join(', ')}`)
    return filteredFiles.map((file: string): string => pathJoin(path, file))
  }

  if (stats.isFile()) {
    Logger.info(`Provided path is a file: ${path}`)
    return [path]
  }

  throw new Error(`Provided path is neither a file nor a directory: ${path}`)
}
