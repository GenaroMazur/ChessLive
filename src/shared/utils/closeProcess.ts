import { logger } from "./logger"
import Core from "../../infrastructure/Core"

export function CloseProcessCallback(applicationModule: Core) {
    return async (err?: Error | unknown) => {
        logger.info("Closing process...")

        if (err && err instanceof Error) console.error("An error occurred: ",err)

        try {
            await applicationModule.stop()
        } catch (err){
            logger.error("Error while stopping the application:")
            logger.error(JSON.stringify(err))
            process.exit(1)
        }

        process.exit(0)
    }
}
