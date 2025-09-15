import fs from 'node:fs';
import * as path from 'node:path';
import Logger from '../Logger';
import type { SarifFileExtension, SarifOptions } from '../types';

/**
 * Traverse directory recursively and returns list of files with the requested
 * extension.
 * @param dir A root directory. Starting point.
 * @param recursive Whether to list files recursively or not.
 * @param extension An instance of {@link SarifFileExtension} type.
 * @param fileList Collected list of files.
 * @private
 */
function listFiles(
  dir: string,
  recursive: boolean,
  extension: SarifFileExtension,
  fileList: string[] = []
): string[] {
  if (fs.statSync(dir).isDirectory()) {
    const entries: string[] = fs.readdirSync(dir);
    entries.forEach((entry: string): void => {
      const fullPath: string = path.join(dir, entry);
      if (recursive && fs.statSync(fullPath).isDirectory()) {
        listFiles(fullPath, recursive, extension, fileList);
      } else if (path.extname(fullPath).toLowerCase() === `.${extension}`) {
        fileList.push(fullPath);
      }
    })
  }
  return fileList;
}

/**
 * Extract list of files based on the parameters from the given {@link SarifOptions}
 * object.
 * @param opts An instance of {@link SarifOptions} type.
 * @internal
 */
export function extractListOfFiles(opts: SarifOptions): string[] {
  const logger = new Logger(extractListOfFiles.name);
  if (!fs.existsSync(opts.path)) {
    throw new Error(`Provided path does not exist: ${opts.path}`);
  }

  const stats: fs.Stats = fs.statSync(opts.path);

  if (stats.isDirectory()) {
    logger.info(`Provided path is a directory: ${opts.path}`);
    const files: string[] = listFiles(opts.path, !!opts.recursive, opts.extension ?? 'sarif');
    logger.info(`Found ${files.length} files in ${opts.path} directory with ${opts.extension} extension`);
    logger.debug(`Found files: ${files.join(', ')}`);
    return files;
  }

  if (stats.isFile()) {
    logger.info(`Provided path is a file: ${opts.path}`);
    return [opts.path];
  }

  throw new Error(`Provided path is neither a file nor a directory: ${opts.path}`);
}
