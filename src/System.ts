import { LIB_VERSION } from './metadata'
import Logger from './Logger'

export default class System {

  public static initialize(): void {
    Logger.info(`Version: ${LIB_VERSION}`)
  }
}
