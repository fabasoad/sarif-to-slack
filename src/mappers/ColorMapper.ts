import Logger from '../Logger'
import { Func } from '../types'

export const mapColor: Func<string | undefined, string | undefined> = (from: string | undefined): string | undefined => {
  switch (from) {
    case 'success':
      Logger.debug(`Converting "${from}" to #008000`)
      return '#008000'
    case 'failure':
      Logger.debug(`Converting "${from}" to #ff0000`)
      return '#ff0000'
    case 'cancelled':
      Logger.debug(`Converting "${from}" to #0047ab`)
      return '#0047ab'
    case 'skipped':
      Logger.debug(`Converting "${from}" to #808080`)
      return '#808080'
    default:
      Logger.debug(`"${from}" color is not a CI status identifier. Returning as is.`)
      return from
  }
}
