import { version, sha, buildAt } from './metadata.json'
import Logger from './Logger'

/**
 * This class prints metadata information into the logs, such as library version,
 * SHA and build time.
 * @internal
 */
export default class System {

  public static initialize(): void {
    Logger.info(`@fabasoad/sarif-to-slack version: ${version}`)
    Logger.info(`@fabasoad/sarif-to-slack sha: ${sha}`)
    Logger.info(`@fabasoad/sarif-to-slack built at: ${buildAt}`)
  }
}
