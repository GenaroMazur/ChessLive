import { DataSource } from "typeorm"
import { inject, injectable } from "tsyringe"
import { ILogger } from "../shared/utils/logger"

const isProduction = process.env?.NODE_ENV?.toLowerCase() === "production"

@injectable()
export default class PostgresConnection {
    public datasource: DataSource
    private readonly logger: ILogger

    constructor(@inject("DATABASE_URL") DATABASE_URL: string, @inject("Logger") logger: ILogger) {
        this.datasource = new DataSource({
            type: "postgres",
            url: DATABASE_URL,
            synchronize: !isProduction,
            logging: false,
            entities: [__dirname + "/../modules/**/*.entity{.js,.ts}"],
            applicationName: "backend-benefits",
        })
        this.logger = logger.child("POSTGRES_CONNECTION")
    }

    async start() {
        await this.datasource.initialize()
        this.logger.info("Postgres: online")
    }

    async stop() {
        await this.datasource.destroy()
        this.logger.info("Postgres: Closed")
    }
}
