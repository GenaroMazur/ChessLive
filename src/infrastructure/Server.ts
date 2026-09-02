import {Server as http} from "http"
import helmet from "helmet"
import cors from "cors"
import {allowedOrigins, getCorsOptions} from "./handlers/http/Cors.config"
import express, {Application} from "express"
import {httpLogger} from "./handlers/http/httpLogger";
import {container, inject, injectable} from "tsyringe";
import {ILogger} from "../shared/utils/logger";

@injectable()
export default class Server {
    public readonly http: http
    public readonly application: Application
    private readonly logger: ILogger

    constructor(@inject("PORT") private readonly PORT: number, @inject("Logger") logger: ILogger) {
        this.http = new http()
        this.application = express()
        this.logger = logger.child("Server")

        this.application.use(httpLogger)
        this.application.use(express.json())
        this.application.use(express.urlencoded({extended: true}))
        this.application.use(cors(getCorsOptions()))
        this.application.use(
            helmet({
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: ["'self'"],
                        connectSrc: ["'self'", ...allowedOrigins],
                        imgSrc: ["'self'", "data:", "https:"],
                        scriptSrc: ["'self'", "'unsafe-inline'"], // unsafe-inline suele ser necesario en Dev para Vite/React
                    },
                },
                crossOriginEmbedderPolicy: false,
                crossOriginOpenerPolicy: true,
                crossOriginResourcePolicy: {policy: "cross-origin"},
                referrerPolicy: {policy: "strict-origin-when-cross-origin"},
                xssFilter: true,
                noSniff: true,
                frameguard: {action: "deny"},
                hidePoweredBy: true,
            }),
        )
        logger.debug(`Server initialized on port ${this.PORT}`)
    }

    public start(): Promise<void> {
        this.logger.debug(`Starting server on port ${this.PORT}`)

        this.http.on("request", this.application)
        return new Promise<void>((res) => {
            this.http.listen(this.PORT, () => {
                this.logger.info(`Server is listening on port ${this.PORT}`)
                res()
            })
        })
    }

    public stop(): Promise<void> {
        this.logger.debug(`Stopping server on port ${this.PORT}`)

        return new Promise<void>((res) => {
            this.http.close(() => {
                this.logger.info(`Server has stopped on port ${this.PORT}`)
                res()
            })
        })
    }
}

container.registerSingleton(Server)