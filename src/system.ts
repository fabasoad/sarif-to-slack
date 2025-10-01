import { z, type ZodSafeParseResult } from 'zod';
import Logger from './Logger';
import { version, sha, buildAt } from './metadata.json';

/**
 * Prints metadata information into the logs, such as library version, SHA and
 * build time.
 * @internal
 */
export function logMetadata(): void {
  const logger = new Logger(logMetadata.name);
  logger.info(`version: ${version}`);
  logger.info(`sha: ${sha}`);
  logger.info(`built at: ${buildAt}`);
}

/**
 * Checks if it is running in GitHub Actions with debug mode enabled.
 * @returns false if ACTIONS_STEP_DEBUG env var is falsy, otherwise returns true.
 * @internal
 */
export function isDebug(): boolean {
  const parseResult: ZodSafeParseResult<boolean> = z.stringbool().safeParse(
    process.env.ACTIONS_STEP_DEBUG
  );
  return parseResult.success && parseResult.data;
}
