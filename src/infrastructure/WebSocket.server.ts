import { Server, WebSocket } from "ws"
import HttpServer from "./Server"
import { EventEmitter } from "node:events"
import { ILogger } from "../shared/utils/logger"
import { IncomingMessage } from "node:http"
import { container, inject, injectable } from "tsyringe"
import Client from "./handlers/websocket/Client"

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
    : []

@injectable()
export default class WebSocketServer extends EventEmitter<{
    newConnection: [Client]
}> {
    private readonly ws: Server
    private interval: NodeJS.Timeout | null = null
    private readonly logger: ILogger

    public readonly rooms = new Map<string, Set<Client>>()

    constructor(@inject("Logger") logger: ILogger, @inject(HttpServer) httpServer: HttpServer) {
        super()
        this.logger = logger.child("WEBSOCKET_SERVER")
        this.ws = new Server({
            server: httpServer.http,
            maxPayload: 1024 * 1024,
            perMessageDeflate: false,
            verifyClient: (info, done) => {
                const origin = info.req.headers.origin
                this.logger.debug(`WS - handshake from ${origin}`)
                if (origin && !allowedOrigins.includes(origin)) {
                    this.logger.debug(`WS - origin not allowed: ${origin}`)
                    return done(false, 403, "Origin not allowed")
                }

                done(true) // Permite la conexión
            },
        })

        this.ws.on("connection", (ws: WebSocket, req: IncomingMessage) => {
            const client = new Client(ws, req.socket.remoteAddress)

            this.logger.debug(`Client connected ${client.identity}`)

            client.on("close", () => {
                this.rooms.forEach((clients) => {
                    clients.delete(client)
                })
            })

            this.emit("newConnection", client)
        })
    }

    start() {
        this.interval = setInterval(() => {
            ;(this.ws.clients as Set<WebSocket>).forEach((ws: WebSocket) => {
                const client = ws.client
                if (!client.isAlive) {
                    this.logger.warn(`terminating client due to inactivity`)
                    return client.close(1001, "Idle timeout")
                }
                client.ping()
            })
        }, 30000)
        this.logger.info(`WebSocket server started`)
    }

    stop() {
        this.ws.removeAllListeners()
        this.ws.clients.forEach((client) => {
            client.close(1000, "Normal closure")
        })
        this.ws.close()
        if (this.interval) clearInterval(this.interval)
        this.logger.info(`WebSocket server stopped`)
    }

    broadcast(message: object, room: string, condition?: (client: Client) => boolean) {
        this.logger.debug(`broadcasting message to room ${room}`)
        this.logger.debug(`clients in room ${room}: ${this.rooms.get(room)?.size}`)
        const json = JSON.stringify(message)
        this.rooms.get(room)?.forEach((client) => {
            if (!condition || condition(client)) {
                client.send(json)
            }
        })
    }

    public joinRoom(room: string, client: Client) {
        this.logger.debug(`joining room ${room} for client ${client.identity}`)
        if (!this.rooms.has(room)) {
            this.rooms.set(room, new Set())
        }
        this.rooms.get(room)!.add(client)
    }

    public leaveRoom(room: string, client: Client) {
        this.rooms.get(room)?.delete(client)
    }
}

container.registerSingleton(WebSocketServer)
