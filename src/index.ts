import "reflect-metadata"
import "dotenv/config"
import "./infrastructure/config"
import "./shared/utils/logger"
import { container } from "tsyringe"
import Core from "./infrastructure/Core"
import { CloseProcessCallback } from "./shared/utils/closeProcess"
import { logger } from "./shared/utils/logger"
import IndexRoutes from "./infrastructure/handlers/http/index.routes"
import ErrorController from "./infrastructure/handlers/http/Error.controller"
import NotFoundController from "./infrastructure/handlers/http/NotFound.controller"
import WsMessageHandler from "./infrastructure/handlers/websocket/WsMessage.handler"

const isProduction = process.env?.NODE_ENV?.toLowerCase() === "production"
if (!isProduction) {
    logger.warn("Running in development mode, please set NODE_ENV=production in .env file")
    logger.warn("This is not recommended for production")
    logger.warn("Many security features are disabled and new passwords aren't safe")
}

const core = container.resolve(Core)

core.server.application.use(IndexRoutes)
core.server.application.use(NotFoundController)
core.server.application.use(ErrorController)

core.webSocketServer.on("newConnection", (c) => {
    c.on("message", (obj) => WsMessageHandler(c, obj))
})

process.on("unhandledRejection", CloseProcessCallback(core))
process.on("uncaughtException", CloseProcessCallback(core))
process.on("SIGINT", CloseProcessCallback(core))
process.on("SIGTERM", CloseProcessCallback(core))

core.start().catch(CloseProcessCallback(core))
