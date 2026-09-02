import {container, injectable, inject} from "tsyringe";
import {ILogger} from "../shared/utils/logger";
import RedisConnection from "./cache/RedisConnection";
import Server from "./Server";
import WebSocketServer from "./WebSocket.server";
import PostgresConnection from "./PostgresConnection";

@injectable()
export default class Core {
    private logger: ILogger;

    constructor(
        @inject("Logger") logger: ILogger,
        @inject(RedisConnection) private readonly redisConnection: RedisConnection,
        @inject(PostgresConnection) private readonly postgresConnection: PostgresConnection,
        @inject(Server) public readonly server: Server,
        @inject(WebSocketServer) public readonly webSocketServer: WebSocketServer
    ) {
        this.logger = logger.child("Core");
    }

    public async start() {
        this.logger.info("Starting core...");
        await Promise.all([
            this.redisConnection.start(),
            this.postgresConnection.start()
        ])

        await this.server.start()
        this.webSocketServer.start()


        return this
    }

    public async stop() {
        this.logger.info("Stopping core...");

        this.webSocketServer.stop()
        await this.server.stop()

        await Promise.all([
            this.redisConnection.stop(),
            this.postgresConnection.stop()
        ])


        return this
    }
}

container.registerSingleton(Core)