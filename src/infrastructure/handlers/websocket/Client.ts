import {EventEmitter} from "node:events"
import {WebSocket} from "ws"
import {logger as Log} from "../../../shared/utils/logger";

const logger = Log.child("WS")
export default class Client extends EventEmitter<{
    message: [object],
    close: []
}> {
    private authTimeout: NodeJS.Timeout | null = null
    public isAlive: boolean = true
    private readonly socket: WebSocket
    public lastActivity: Date = new Date()

    get identity() {
        return `||${this.addr}`
    }

    public constructor(
        socket: WebSocket,
        public readonly addr?: string,
    ) {
        super()
        this.socket = socket
        socket.client = this

        this.socket.on("message", (data) => {
            const message = data.toString()
            this.lastActivity = new Date()
            this.isAlive = true
            logger.info(`ws:${this.identity}: ${message}`)

            this.emit("message", JSON.parse(message))
        })

        this.socket.on("pong", () => {
            this.isAlive = true
        })

        this.socket.on("close", () => {
            this.clearAuthTimeout()
            logger.debug(`Client disconnected ${this.identity}`)
            this.emit("close")
        })

        this.socket.on("error", (error) => {
            logger.error(`Socket error: ${error.message}`)
            this.close(1011, "Internal error")
        })
    }

    setAuthTimeout(ms: number, callback: (client: this) => void) {
        this.clearAuthTimeout()
        this.authTimeout = setTimeout(() => callback(this), ms)
    }

    clearAuthTimeout() {
        if (this.authTimeout) {
            clearTimeout(this.authTimeout)
            this.authTimeout = null
        }
    }

    ping() {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.isAlive = false
            this.socket.ping()
        }
    }

    send(message: string) {
        if (this.socket.readyState !== WebSocket.OPEN) return

        // ⚠️ Protección ante clientes lentos (Backpressure)
        // Si hay más de 1MB encolado esperando salir hacia este cliente
        if (this.socket.bufferedAmount > 1024 * 1024) {
            logger.warn(
                `Client buffer full (${this.socket.bufferedAmount} bytes). Closing connection.`,
            )
            return this.close(4008, "Buffer overflow")
        }

        logger.debug(`send: ${message}`)
        this.socket.send(message)
    }

    close(status: number = 1000, reason: string = "Normal closure") {
        this.socket.close(status, reason)
    }
}
