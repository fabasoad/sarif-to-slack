import {
  type LogLevel,
  configureSync,
  getConsoleSink,
  getAnsiColorFormatter,
} from "@logtape/logtape";
import type { LoggerOptions } from "./types";

/**
 * Accepted value for the `category` option of `AnsiColorFormatterOptions`.
 *
 * - `string` — a fixed label rendered as the category in every log line.
 * - `(category: readonly string[]) => string` — a function that maps the logtape category path to a display label.
 * - `undefined` — use logtape's default category rendering.
 *
 * @private
 */
type FormatterCategory = string | ((category: readonly string[]) => string) | undefined;

/**
 * Initializes the global logtape logger with a console sink and ANSI color formatting.
 *
 * Configures two loggers:
 * - The logtape meta logger (category `["logtape", "meta"]`), clamped to at least `"warning"`.
 * - The root logger (category `[]`), set to `lowestLevel` (defaults to `"info"`).
 *
 * Calling this function resets any previously registered logtape configuration.
 *
 * @param opts - An instance of {@link LoggerOptions}.
 *
 * @public
 */
export function setupLogger(opts?: LoggerOptions): void {
  const lowestLevel: LogLevel = opts?.lowestLevel ?? "info";
  const category: FormatterCategory =
    opts?.name && opts?.name.length > 0
      ? (_: readonly string[]): string => opts.name as string
      : undefined;

  configureSync({
    reset: false,
    sinks: {
      console: getConsoleSink({
        formatter: getAnsiColorFormatter({ category }),
      }),
    },
    loggers: [
      {
        category: ["logtape", "meta"],
        lowestLevel: Array.from<LogLevel>(["warning", "error", "fatal"]).includes(lowestLevel)
          ? lowestLevel
          : "warning",
        sinks: ["console"],
      },
      {
        category: [],
        lowestLevel: lowestLevel,
        sinks: ["console"],
      },
    ],
  });
}
