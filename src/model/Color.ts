import { SarifModel, SecurityLevel, SecuritySeverity } from '../types'
import { Finding } from './Finding'

export class Color {
  private readonly _color?: string

  public constructor(color?: string) {
    this._color = this.mapColor(color)
    this.validateHexColor()
  }

  public get value(): string | undefined {
    return this._color
  }

  private validateHexColor(): void {
    if (this._color != null) {
      const hexColorRegex = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

      if (!hexColorRegex.test(this._color)) {
        throw new Error(`Invalid hex color: "${this._color}"`);
      }
    }
  }

  private mapColor(from?: string): string | undefined {
    switch (from) {
      case 'success':
        return '#008000'
      case 'failure':
        return '#ff0000'
      case 'cancelled':
        return '#0047ab'
      case 'skipped':
        return '#808080'
      default:
        return from
    }
  }
}

type ColorGroupCommon = {
  none?: Color,
  unknown?: Color,
  empty?: Color,
}

export type ColorGroupByLevel = ColorGroupCommon & {
  error?: Color,
  warning?: Color,
  note?: Color,
}

export type ColorGroupBySeverity = ColorGroupCommon & {
  critical?: Color,
  high?: Color,
  medium?: Color,
  low?: Color,
}

export type ColorOptions = {
  byLevel?: ColorGroupByLevel,
  bySeverity?: ColorGroupBySeverity,
}

function isColor(color?: Color | ColorOptions): color is Color {
  return color != null && color instanceof Color
}

function isColorOptions(color?: Color | ColorOptions): color is ColorOptions {
  return color != null
}

function identifyColorCommon<K extends keyof Finding>(
  sarifModel: SarifModel,
  prop: K,
  none: Finding[K],
  unknown: Finding[K],
  color: ColorGroupCommon
): string | undefined {
  if (color.none != null && sarifModel.findings.findByProperty(prop, none) != null) {
    return color.none.value
  }

  if (color.unknown != null && sarifModel.findings.findByProperty(prop, unknown) != null) {
    return color.unknown.value
  }

  if (color.empty != null && sarifModel.findings.length === 0) {
    return color.empty.value
  }

  return undefined
}

function identifyColorBySeverity(sarifModel: SarifModel, color: ColorGroupBySeverity): string | undefined {
  if (color.critical != null && sarifModel.findings.findByProperty('severity', SecuritySeverity.Critical) != null) {
    return color.critical.value
  }

  if (color.high != null && sarifModel.findings.findByProperty('severity', SecuritySeverity.High) != null) {
    return color.high.value
  }

  if (color.medium != null && sarifModel.findings.findByProperty('severity', SecuritySeverity.Medium) != null) {
    return color.medium.value
  }

  if (color.low != null && sarifModel.findings.findByProperty('severity', SecuritySeverity.Low) != null) {
    return color.low.value
  }

  return identifyColorCommon(sarifModel, 'severity', SecuritySeverity.None, SecuritySeverity.Unknown, color)
}

function identifyColorByLevel(sarifModel: SarifModel, color: ColorGroupByLevel): string | undefined {
  if (color.error != null && sarifModel.findings.findByProperty('level', SecurityLevel.Error) != null) {
    return color.error.value
  }

  if (color.warning != null && sarifModel.findings.findByProperty('level', SecurityLevel.Warning) != null) {
    return color.warning.value
  }

  if (color.note != null && sarifModel.findings.findByProperty('level', SecurityLevel.Note) != null) {
    return color.note.value
  }

  return identifyColorCommon(sarifModel, 'level', SecurityLevel.None, SecurityLevel.Unknown, color)
}

export function identifyColor(sarifModel: SarifModel, color?: Color | ColorOptions): string | undefined {
  if (color == null) {
    return undefined
  }

  if (isColor(color)) {
    return color.value
  }

  if (isColorOptions(color)) {
    if (color.bySeverity != null) {
      return identifyColorBySeverity(sarifModel, color.bySeverity)
    }

    if (color.byLevel != null) {
      return identifyColorByLevel(sarifModel, color.byLevel)
    }
  }

  return undefined
}
