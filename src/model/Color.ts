import { SecurityLevel, SecuritySeverity } from '../types'
import Finding from './Finding'
import FindingArray from './FindingArray'
import Logger from '../Logger'

/**
 * This class represents a color in hex format.
 * @public
 */
export class Color {
  private readonly _color?: string

  /**
   * Creates an instance of {@link Color} class. Before creating an instance of
   * {@link Color} class, it (if applicable) maps CI status into the hex color,
   * and also validates color parameter to be a valid string that represents a
   * color in hex format.
   * @param color - Can be either undefined, valid color in hex format or GitHub
   * CI status (one of: success, failure, cancelled, skipped)
   * @public
   */
  public constructor(color?: string) {
    this._color = this.mapColor(color)
    this.assertHexColor()
  }

  /**
   * Returns a valid string that represents a color in hex format, or undefined.
   */
  public get value(): string | undefined {
    return this._color
  }

  private assertHexColor(): void {
    if (this._color) {
      const hexColorRegex = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/

      if (!hexColorRegex.test(this._color)) {
        throw new Error(`Invalid hex color: "${this._color}"`)
      }
    }
  }

  private mapColor(from: string = 'unknown'): string | undefined {
    const map = new Map<string, string>([
      ['success', '#008000'],
      ['failure', '#ff0000'],
      ['cancelled', '#0047ab'],
      ['skipped', '#808080'],
    ])
    return map.get(from)
  }
}

/**
 * Base type that has common fields for both {@link ColorGroupByLevel} and
 * {@link ColorGroupBySeverity}.
 */
type ColorGroupCommon = {
  none?: Color,
  unknown?: Color,
}

/**
 * Color schema for the findings with the certain level. Color is used by the
 * level importance, i.e. if at least 1 error finding exists then
 * {@link ColorGroupByLevel.error} color is used, then if at least 1 warning
 * finding exists then {@link ColorGroupByLevel.warning} color is used, etc.
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

function identifyColorCommon<K extends keyof Finding>(
  findings: FindingArray,
  prop: K,
  none: Finding[K],
  unknown: Finding[K],
  color: ColorGroupCommon
): string | undefined {
  if (color.none != null && findings.findByProperty(prop, none) != null) {
    return color.none.value
  }

  if (color.unknown != null && findings.findByProperty(prop, unknown) != null) {
    return color.unknown.value
  }

  return undefined
}

function identifyColorBySeverity(findings: FindingArray, color: ColorGroupBySeverity): string | undefined {
  if (color.critical != null && findings.findByProperty('severity', SecuritySeverity.Critical) != null) {
    return color.critical.value
  }

  if (color.high != null && findings.findByProperty('severity', SecuritySeverity.High) != null) {
    return color.high.value
  }

  if (color.medium != null && findings.findByProperty('severity', SecuritySeverity.Medium) != null) {
    return color.medium.value
  }

  if (color.low != null && findings.findByProperty('severity', SecuritySeverity.Low) != null) {
    return color.low.value
  }

  return identifyColorCommon(findings, 'severity', SecuritySeverity.None, SecuritySeverity.Unknown, color)
}

function identifyColorByLevel(findings: FindingArray, color: ColorGroupByLevel): string | undefined {
  if (color.error != null && findings.findByProperty('level', SecurityLevel.Error) != null) {
    return color.error.value
  }

  if (color.warning != null && findings.findByProperty('level', SecurityLevel.Warning) != null) {
    return color.warning.value
  }

  if (color.note != null && findings.findByProperty('level', SecurityLevel.Note) != null) {
    return color.note.value
  }

  return identifyColorCommon(findings, 'level', SecurityLevel.None, SecurityLevel.Unknown, color)
}

/**
 * Makes an ultimate decision on what color should be Slack message. The decision
 * is based on the provided {@param colorOpts} parameter and {@param findings}
 * list.
 * @param findings An instance of {@link FindingArray} object.
 * @param colorOpts An instance of {@link ColorOptions} type.
 * @internal
 */
export function identifyColor(findings: FindingArray, colorOpts?: ColorOptions): string | undefined {
  if (!colorOpts) {
    Logger.debug('Message has no color as color options are not defined.')
    return undefined
  }
  Logger.trace(`Identifying color for ${findings.length} findings and the following color options:`, JSON.stringify({ ...colorOpts }, null, 2))

  if (colorOpts.bySeverity) {
    const color: string | undefined = identifyColorBySeverity(findings, colorOpts.bySeverity)
    if (color) {
      Logger.debug(`Message has ${color} color based on the "bySeverity" group.`)
      return color
    } else {
      Logger.trace('None of the properties in "bySeverity" group is defined. Continue color identification...')
    }
  } else {
    Logger.trace('"bySeverity" group is not defined. Continue color identification...')
  }

  if (colorOpts.byLevel) {
    const color: string | undefined = identifyColorByLevel(findings, colorOpts.byLevel)
    if (color) {
      Logger.debug(`Message has ${color} color based on the "byLevel" group.`)
      return color
    } else {
      Logger.trace('None of the properties in "byLevel" group is defined. Continue color identification...')
    }
  } else {
    Logger.trace('"byLevel" group is not defined. Continue color identification...')
  }

  if (findings.length === 0) {
    Logger.trace('There are no findings in provided SARIF file(s). Checking if color is defined in "empty" property...')
    if (colorOpts.empty?.value) {
      Logger.debug(`Message has ${colorOpts.empty.value} color as there are no findings in SARIF.`)
      return colorOpts.empty.value
    } else {
      Logger.trace('"empty" color is not defined. Continue color identification...')
    }
  } else {
    Logger.trace(`There are ${findings.length} findings in provided SARIF file(s). "empty" color is not taken into account. Continue color identification...`)
  }

  if (colorOpts.default?.value) {
    Logger.debug(`Message has ${colorOpts.default.value} default color.`)
  } else {
    Logger.debug('Message has no color as none of the defined color options applicable.')
  }

  return colorOpts?.default?.value
}
