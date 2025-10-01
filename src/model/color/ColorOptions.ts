import type { Color } from './Color'

/**
 * Base type that has common fields for both {@link ColorGroupByLevel} and
 * {@link ColorGroupBySeverity}.
 * @public
 */
export type ColorGroupCommon = {
  none?: Color,
  unknown?: Color,
}

/**
 * Color schema for the findings with the certain level. Color is used by the
 * level importance, i.e. if at least 1 error finding exists then
 * {@link ColorGroupByLevel#error} color is used, then if at least 1 warning
 * finding exists then {@link ColorGroupByLevel#warning} color is used, etc.
 * @public
 */
export type ColorGroupByLevel = ColorGroupCommon & {
  error?: Color,
  warning?: Color,
  note?: Color,
}

/**
 * Color schema for the findings with the certain severity. Color is used by the
 * severity importance, i.e. if at least 1 critical finding exists then
 * {@link ColorGroupBySeverity#critical} color is used, then if at least 1 high
 * finding exists then {@link ColorGroupBySeverity#high} color is used, etc.
 * @public
 */
export type ColorGroupBySeverity = ColorGroupCommon & {
  critical?: Color,
  high?: Color,
  medium?: Color,
  low?: Color,
}

/**
 * Represents configuration of the color scheme. If both {@link ColorOptions#byLevel}
 * and {@link ColorOptions#bySeverity} are defined, then {@link ColorOptions#bySeverity}
 * takes precedence.
 * @public
 */
export type ColorOptions = {
  /**
   * Default color if specific color was not found. It is a fallback option.
   */
  default?: Color,
  /**
   * Color scheme for the findings where certain level is presented.
   */
  byLevel?: ColorGroupByLevel,
  /**
   * Color scheme for the findings where certain severity is presented.
   */
  bySeverity?: ColorGroupBySeverity,
  /**
   * Color when no findings are found.
   */
  empty?: Color,
}
