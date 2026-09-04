export default class Game {
    id: string

    whitePlayerId: string;
    blackPlayerId: string;

    moves: string[]
    fen: string
    pgn?: string

    timeControl: string

    result?: "WHITE" | "BLACK" | "DRAW"
    reason?: "MATE" | "TIMEOUT" | "RESIGN" | "DRAW" | "INSUFFICIENT MATERIAL" | "STALEMATE" | "THREEFOLD REPETITION"

    gameInfo: {
        clockSeconds: { w: number, b?: number }[]
    }

    createdAt: Date
    updatedAt: Date
}