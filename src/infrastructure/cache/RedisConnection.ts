import {createClient} from "redis"
import {EventEmitter} from "node:events"
import {container, inject, injectable} from "tsyringe";
import {ILogger} from "../../shared/utils/logger";

@injectable()
export default class RedisConnection extends EventEmitter<{
    /**
     * (message,channel)
     */
    message: [string, string],
    online: [],
    error: [Error],
    subscription_error: [Error]
}> {
    private connection: ReturnType<typeof createClient> | null = null
    private subscription: ReturnType<typeof createClient> | null = null
    private subscribedChannels: Set<string> = new Set()
    private logger: ILogger

    constructor(@inject("REDIS_URL") private readonly redisUrl: string = "", @inject("Logger") logger: ILogger) {
        super()
        this.logger = logger.child("Redis_Connection")
    }

    private getClientConfig(name: string) {
        return {
            url: this.redisUrl,
            name: `backend-chess-live-${name}`,
        }
    }

    public async start() {
        if (this.connection) this.connection.destroy()

        this.connection = createClient(this.getClientConfig("main"))
        this.subscription = createClient(this.getClientConfig("subscription"))

        this.connection.on("connect", () => {
            this.logger.info("Redis: online")
            this.emit("online")
        })

        this.connection.on("error", (err) => {
            this.logger.error(`Redis Error: ${err.message}`)
            this.logger.error(err)
            this.emit("error", err)
        })

        this.subscription.on("connect", () => {
            this.logger.info("Redis Subscription: connected")
            if (this.subscribedChannels.size > 0) {
                const channels = Array.from(this.subscribedChannels)
                this.logger.info(
                    `Redis Subscription: re-subscribing to channels: ${channels.join(", ")}`,
                )
                this.subscription
                    ?.subscribe(channels, (message, chan) => {
                        this.emit("message", message, chan)
                    })
                    .catch((err) =>
                        this.logger.error(`Redis Subscription: error re-subscribing: ${err.message}`),
                    )
            }
        })

        this.subscription.on("error", (err) => {
            this.logger.error(`Redis Subscription Error: ${err.message}`)
            this.emit("subscription_error", err)
        })

        await this.connection.connect()
        await this.subscription.connect()

        return this
    }

    public async setSubscription(channel: string | string[]) {
        const channels = Array.isArray(channel) ? channel : [channel]
        channels.forEach((ch) => this.subscribedChannels.add(ch))

        if (this.subscription?.isOpen) {
            await this.subscription
                .subscribe(channels, (message, channel) => {
                    this.emit("message", message, channel)
                })
                .catch((err) =>
                    this.logger.error(`Redis Subscription: error subscribing: ${err.message}`),
                )
        }
    }

    public async stop() {
        if (this.connection) this.connection.destroy()
        if (this.subscription) this.subscription.destroy()
        this.logger.info("Redis: Closed")
    }

    public publish(channel: string, message: string | object) {
        if (!this.connection) throw new Error("Connection not established")

        this.connection
            .publish(channel, typeof message === "string" ? message : JSON.stringify(message))
            .catch((err) => this.logger.error(`Redis Subscription: error publishing: ${err.message}`))
    }

    public get caching() {
        return this.connection
    }
}

container.registerSingleton(RedisConnection)
