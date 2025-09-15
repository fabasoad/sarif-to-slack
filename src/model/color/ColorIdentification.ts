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

function logColorTaken(
  logger: Logger,
  color: Color | undefined,
  prop: string
): void {
  logger.debug(`Message has ${color?.color} color taken from '${prop}' property.`)
}

function logPropDefinedButNoFindings<K extends keyof Pick<Finding, 'level' | 'severity'>>(
  logger: Logger,
  key: K,
  val: string
): void {
  const prop: string = key === 'level' ? 'byLevel' : 'bySeverity'
  logger.trace(`'${prop}.${val}' property is defined but no findings with "${val}" ${key} is found. Continue color identification...`)
}

function logPropIsNotDefined<K extends keyof Pick<Finding, 'level' | 'severity'>>(
  logger: Logger,
  key: K,
  val: string
): void {
  const prop: string = key === 'level' ? 'byLevel' : 'bySeverity'
  logger.trace(`'${prop}.${val}' property is not defined. Continue color identification...`)
}

function identifyColorCommon<K extends keyof Pick<Finding, 'level' | 'severity'>>(
  findings: FindingArray,
  prop: K,
  none: Finding[K],
  unknown: Finding[K],
  color: ColorGroupCommon
): string | undefined {
  const logger = new Logger(identifyColorCommon.name);
  if (color.none) {
    if (findings.findByProperty(prop, none) != null) {
      logColorTaken(logger, color.none, `${prop === 'severity' ? 'bySeverity' : 'byLevel'}.none`)
      return color.none.color
    } else {
      logPropDefinedButNoFindings(logger, prop, 'none')
    }
  } else {
    logPropIsNotDefined(logger, prop, 'none')
  }

  if (color.unknown) {
    if (findings.findByProperty(prop, unknown) != null) {
      logColorTaken(logger, color.unknown, `${prop === 'severity' ? 'bySeverity' : 'byLevel'}.unknown`)
      return color.unknown.color
    } else {
      logPropDefinedButNoFindings(logger, prop, 'unknown')
    }
  } else {
    logPropIsNotDefined(logger, prop, 'unknown')
  }

  return undefined
}

function identifyColorBySeverity(findings: FindingArray, color: ColorGroupBySeverity): string | undefined {
  const logger = new Logger(identifyColorBySeverity.name);
  if (color.critical) {
    if (findings.findByProperty('severity', SecuritySeverity.Critical) != null) {
      logColorTaken(logger, color.critical, 'bySeverity.critical')
      return color.critical.color
    } else {
      logPropDefinedButNoFindings(logger, 'severity', 'critical')
    }
  } else {
    logPropIsNotDefined(logger, 'severity', 'critical')
  }

  if (color.high) {
    if (findings.findByProperty('severity', SecuritySeverity.High) != null) {
      logColorTaken(logger, color.high, 'bySeverity.high')
      return color.high.color
    } else {
      logPropDefinedButNoFindings(logger, 'severity', 'high')
    }
  } else {
    logPropIsNotDefined(logger, 'severity', 'high')
  }

  if (color.medium) {
    if (findings.findByProperty('severity', SecuritySeverity.Medium) != null) {
      logColorTaken(logger, color.medium, 'bySeverity.medium')
      return color.medium.color
    } else {
      logPropDefinedButNoFindings(logger, 'severity', 'medium')
    }
  } else {
    logPropIsNotDefined(logger, 'severity', 'medium')
  }

  if (color.low) {
    if (findings.findByProperty('severity', SecuritySeverity.Low) != null) {
      logColorTaken(logger, color.low, 'bySeverity.low')
      return color.low.color
    } else {
      logPropDefinedButNoFindings(logger, 'severity', 'low')
    }
  } else {
    logPropIsNotDefined(logger, 'severity', 'low')
  }

  return identifyColorCommon(findings, 'severity', SecuritySeverity.None, SecuritySeverity.Unknown, color)
}

function identifyColorByLevel(findings: FindingArray, color: ColorGroupByLevel): string | undefined {
  const logger = new Logger(identifyColorByLevel.name);
  if (color.error) {
    if (findings.findByProperty('level', SecurityLevel.Error) != null) {
      logColorTaken(logger, color.error, 'byLevel.error')
      return color.error.color
    } else {
      logPropDefinedButNoFindings(logger, 'level', 'error')
    }
  } else {
    logPropIsNotDefined(logger, 'level', 'error')
  }

  if (color.warning) {
    if (findings.findByProperty('level', SecurityLevel.Warning) != null) {
      logColorTaken(logger, color.warning, 'byLevel.warning')
      return color.warning.color
    } else {
      logPropDefinedButNoFindings(logger, 'level', 'warning')
    }
  } else {
    logPropIsNotDefined(logger, 'level', 'warning')
  }

  if (color.note != null) {
    if (findings.findByProperty('level', SecurityLevel.Note) != null) {
      logColorTaken(logger, color.note, 'byLevel.note')
      return color.note.color
    } else {
      logPropDefinedButNoFindings(logger, 'level', 'note')
    }
  } else {
    logPropIsNotDefined(logger, 'level', 'note')
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
  const logger = new Logger(identifyColor.name);
  if (!colorOpts) {
    logger.debug('Message has no color as color options are not defined.')
    return undefined
  }
  logger.trace(`Identifying color for ${findings.length} findings and the following color options:`, JSON.stringify(colorOpts, null, 2))

  if (colorOpts.bySeverity) {
    const color: string | undefined = identifyColorBySeverity(findings, colorOpts.bySeverity)
    if (color) {
      return color
    }
    logger.trace('None of the properties in \'bySeverity\' group is applicable. Continue color identification...')
  } else {
    logger.trace('\'bySeverity\' group is not defined. Continue color identification...')
  }

  if (colorOpts.byLevel) {
    const color: string | undefined = identifyColorByLevel(findings, colorOpts.byLevel)
    if (color) {
      return color
    }
    logger.trace('None of the properties in \'byLevel\' group is applicable. Continue color identification...')
  } else {
    logger.trace('\'byLevel\' group is not defined. Continue color identification...')
  }

  if (findings.length === 0) {
    logger.trace('There are no findings in the provided SARIF file(s). Checking if color is defined in "empty" property...')
    if (colorOpts.empty?.color) {
      logColorTaken(logger, colorOpts.empty, 'empty')
      return colorOpts.empty.color
    } else {
      logger.trace('"empty" color is not defined. Continue color identification...')
    }
  } else {
    logger.trace(`"empty" color is not taken into account because there are ${findings.length} findings in the provided SARIF file(s). Continue color identification...`)
  }

  if (colorOpts.default?.color) {
    logColorTaken(logger, colorOpts.default, 'default')
  } else {
    logger.debug('Message has no color as none of the defined color options is applicable.')
  }

  return colorOpts?.default?.color
}
