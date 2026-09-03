export default class Game {
    id: string

    whitePlayerId: string;
    blackPlayerId: string;

    moves: string[]
    fen: string
    pgn?: string

    timeControl: string

    result?: "WHITE" | "BLACK" | "DRAW"
    reason?: "MATE" | "TIMEOUT" | "RESIGN" | "DRAW" | "INSUFFICIENT MATERIAL" | "STALEMATE"

    gameInfo: {
        clock: [number, number][]
    }

    createdAt: Date
}