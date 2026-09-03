import { logger } from "./logger"
import Core from "../../infrastructure/Core"

export function CloseProcessCallback(applicationModule: Core) {
    return async (err?: Error | unknown) => {
        logger.info("Closing process...")

        if (err && err instanceof Error) logger.error("An error occurred:")

        try {
            await applicationModule.stop()
        } catch {
            logger.error("Error while stopping the application:")
            process.exit(1)
        }

        process.exit(0)
    }
}
