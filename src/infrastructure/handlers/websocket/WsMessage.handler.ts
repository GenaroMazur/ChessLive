import Client from "./Client"
import { container } from "tsyringe"
import WebSocketServer from "../../WebSocket.server"
import SystemException from "../../../shared/exceptions/System.exception"

export default function WsMessageHandler(client: Client, obj: object) {
    if (obj === null) return

    if (!("subscribe" in obj) || typeof obj.subscribe !== "string") return

    const webSocketServer = container.resolve(WebSocketServer)
    if (!webSocketServer) throw new SystemException("WebSocket server not initialized")

    webSocketServer.joinRoom(`${obj.subscribe}`, client)
}
