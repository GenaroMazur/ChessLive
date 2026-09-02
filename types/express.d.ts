import Client from "../src/infrastructure/handlers/websocket/Client"

declare module "ws" {
    export interface WebSocket {
        client: Client
    }
}

