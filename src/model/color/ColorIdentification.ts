import type Finding from '../Finding'
import type FindingArray from '../FindingArray'
import { SecurityLevel, SecuritySeverity } from '../../types'
import Logger from '../../Logger'
import type {
  ColorGroupByLevel,
  ColorGroupBySeverity,
  ColorGroupCommon,
  ColorOptions
} from './ColorOptions'
import type { Color } from './Color';

function logColorTaken(color: Color | undefined, prop: string): void {
  Logger.debug(`Message has ${color?.color} color taken from '${prop}' property.`)
}

function logPropDefinedButNoFindings<K extends keyof Pick<Finding, 'level' | 'severity'>>(key: K, val: string): void {
  const prop: string = key === 'level' ? 'byLevel' : 'bySeverity'
  Logger.trace(`'${prop}.${val}' property is defined but no findings with "${val}" ${key} is found. Continue color identification...`)
}

function logPropIsNotDefined<K extends keyof Pick<Finding, 'level' | 'severity'>>(key: K, val: string): void {
  const prop: string = key === 'level' ? 'byLevel' : 'bySeverity'
  Logger.trace(`'${prop}.${val}' property is not defined. Continue color identification...`)
}

function identifyColorCommon<K extends keyof Pick<Finding, 'level' | 'severity'>>(
  findings: FindingArray,
  prop: K,
  none: Finding[K],
  unknown: Finding[K],
  color: ColorGroupCommon
): string | undefined {
  if (color.none) {
    if (findings.findByProperty(prop, none) != null) {
      logColorTaken(color.none, `${prop === 'severity' ? 'bySeverity' : 'byLevel'}.none`)
      return color.none.color
    } else {
      logPropDefinedButNoFindings(prop, 'none')
    }
  } else {
    logPropIsNotDefined(prop, 'none')
  }

  if (color.unknown) {
    if (findings.findByProperty(prop, unknown) != null) {
      logColorTaken(color.unknown, `${prop === 'severity' ? 'bySeverity' : 'byLevel'}.unknown`)
      return color.unknown.color
    } else {
      logPropDefinedButNoFindings(prop, 'unknown')
    }
  } else {
    logPropIsNotDefined(prop, 'unknown')
  }

  return undefined
}

function identifyColorBySeverity(findings: FindingArray, color: ColorGroupBySeverity): string | undefined {
  if (color.critical) {
    if (findings.findByProperty('severity', SecuritySeverity.Critical) != null) {
      logColorTaken(color.critical, 'bySeverity.critical')
      return color.critical.color
    } else {
      logPropDefinedButNoFindings('severity', 'critical')
    }
  } else {
    logPropIsNotDefined('severity', 'critical')
  }

  if (color.high) {
    if (findings.findByProperty('severity', SecuritySeverity.High) != null) {
      logColorTaken(color.high, 'bySeverity.high')
      return color.high.color
    } else {
      logPropDefinedButNoFindings('severity', 'high')
    }
  } else {
    logPropIsNotDefined('severity', 'high')
  }

  if (color.medium) {
    if (findings.findByProperty('severity', SecuritySeverity.Medium) != null) {
      logColorTaken(color.medium, 'bySeverity.medium')
      return color.medium.color
    } else {
      logPropDefinedButNoFindings('severity', 'medium')
    }
  } else {
    logPropIsNotDefined('severity', 'medium')
  }

  if (color.low) {
    if (findings.findByProperty('severity', SecuritySeverity.Low) != null) {
      logColorTaken(color.low, 'bySeverity.low')
      return color.low.color
    } else {
      logPropDefinedButNoFindings('severity', 'low')
    }
  } else {
    logPropIsNotDefined('severity', 'low')
  }

  return identifyColorCommon(findings, 'severity', SecuritySeverity.None, SecuritySeverity.Unknown, color)
}

function identifyColorByLevel(findings: FindingArray, color: ColorGroupByLevel): string | undefined {
  if (color.error) {
    if (findings.findByProperty('level', SecurityLevel.Error) != null) {
      logColorTaken(color.error, 'byLevel.error')
      return color.error.color
    } else {
      logPropDefinedButNoFindings('level', 'error')
    }
  } else {
    logPropIsNotDefined('level', 'error')
  }

  if (color.warning) {
    if (findings.findByProperty('level', SecurityLevel.Warning) != null) {
      logColorTaken(color.warning, 'byLevel.warning')
      return color.warning.color
    } else {
      logPropDefinedButNoFindings('level', 'warning')
    }
  } else {
    logPropIsNotDefined('level', 'warning')
  }

  if (color.note != null) {
    if (findings.findByProperty('level', SecurityLevel.Note) != null) {
      logColorTaken(color.note, 'byLevel.note')
      return color.note.color
    } else {
      logPropDefinedButNoFindings('level', 'note')
    }
  } else {
    logPropIsNotDefined('level', 'note')
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
  Logger.trace(`Identifying color for ${findings.length} findings and the following color options:`, JSON.stringify(colorOpts, null, 2))

  if (colorOpts.bySeverity) {
    const color: string | undefined = identifyColorBySeverity(findings, colorOpts.bySeverity)
    if (color) {
      return color
    }
    Logger.trace('None of the properties in \'bySeverity\' group is applicable. Continue color identification...')
  } else {
    Logger.trace('\'bySeverity\' group is not defined. Continue color identification...')
  }

  if (colorOpts.byLevel) {
    const color: string | undefined = identifyColorByLevel(findings, colorOpts.byLevel)
    if (color) {
      return color
    }
    Logger.trace('None of the properties in \'byLevel\' group is applicable. Continue color identification...')
  } else {
    Logger.trace('\'byLevel\' group is not defined. Continue color identification...')
  }

  if (findings.length === 0) {
    Logger.trace('There are no findings in the provided SARIF file(s). Checking if color is defined in "empty" property...')
    if (colorOpts.empty?.color) {
      logColorTaken(colorOpts.empty, 'empty')
      return colorOpts.empty.color
    } else {
      Logger.trace('"empty" color is not defined. Continue color identification...')
    }
  } else {
    Logger.trace(`"empty" color is not taken into account because there are ${findings.length} findings in the provided SARIF file(s). Continue color identification...`)
  }

  if (colorOpts.default?.color) {
    logColorTaken(colorOpts.default, 'default')
  } else {
    Logger.debug('Message has no color as none of the defined color options is applicable.')
  }

  return colorOpts?.default?.color
}
