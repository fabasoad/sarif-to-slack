import type { LoggerOptions } from './types';

/**
 * Global state for appsec-findings-summary.
 * @internal
 */
export type GlobalState = {
  loggerOpts?: LoggerOptions,
}

export const globalState: GlobalState = {};
