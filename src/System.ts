import { version, sha, buildAt } from './metadata.json'
import Logger from './Logger'

export default class System {

  public static initialize(): void {
    Logger.info(`@fabasoad/sarif-to-slack version: ${version}`)
    Logger.info(`@fabasoad/sarif-to-slack sha: ${sha}`)
    Logger.info(`@fabasoad/sarif-to-slack build at: ${buildAt}`)
  }
}
