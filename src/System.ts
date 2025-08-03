import { LIB_VERSION } from './metadata'
import Logger from './Logger'

export default class System {

  public static initialize(): void {
    Logger.info(`@fabasoad/sarif-to-slack version: ${LIB_VERSION}`)
  }
}
