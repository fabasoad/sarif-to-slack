import { LIB_BUILT_AT, LIB_SHA, LIB_VERSION } from './metadata'
import Logger from './Logger'

export default class System {

  public static initialize(): void {
    Logger.info(`Version: ${LIB_VERSION}`)
    Logger.info(`SHA: ${LIB_SHA}`)
    Logger.info(`Built at: ${LIB_BUILT_AT}`)
  }
}
