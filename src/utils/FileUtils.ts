import fs from 'fs'
import Logger from '../Logger'
import { SarifFileExtension, SarifOptions } from '../types'
import * as path from 'path'

function listFilesRecursively(dir: string, extension: SarifFileExtension, fileList: string[] = []): string[] {
  const entries = fs.readdirSync(dir);
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      listFilesRecursively(fullPath, extension, fileList);
    } else if (path.extname(fullPath).toLowerCase() === `.${extension}`) {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

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
    const filteredFiles: string[] = files.filter((file: string): boolean =>
      path.extname(file).toLowerCase() === `.${opts.extension}`
    )
    Logger.info(`Found ${filteredFiles.length} files in ${opts.path} directory with ${opts.extension} extension`)
    Logger.debug(`Found files: ${filteredFiles.join(', ')}`)
    return filteredFiles.map((file: string): string => path.join(opts.path, file))
  }

  if (stats.isFile()) {
    Logger.info(`Provided path is a file: ${opts.path}`)
    return [opts.path]
  }

  throw new Error(`Provided path is neither a file nor a directory: ${opts.path}`)
}
