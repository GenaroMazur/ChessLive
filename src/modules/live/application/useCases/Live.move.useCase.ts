import {inject, injectable} from "tsyringe";
import GameLiveService from "../../domain/interfaces/GameLive.service";
import Context from "../../../../shared/entity/Context";
import LiveGetStateUseCase from "./Live.getState.useCase";
import {Chess} from "chess.js";
import BadRequestException from "../../../../shared/exceptions/BadRequest.exception";

@injectable()
export default class LiveMoveUseCase {
    constructor(
        @inject("GameLiveService") private readonly gameLiveService: GameLiveService,
        @inject(LiveGetStateUseCase) private readonly liveGetStateUseCase: LiveGetStateUseCase
    ) {
    }

    //TODO: la terminación de la partida por rendición o por tiempo se debe hacer en otro use case
    async execute(context: Context, gameId: string, move: string) {
        const game = await this.liveGetStateUseCase.execute(context, gameId);

        if (!game) return null

        const chess = new Chess(game.fen)

        if (chess.isGameOver() || !!game.result) throw new BadRequestException("Game is over")

        const userColor = context.userId === game.whitePlayerId ? "w" : "b"

        if (chess.turn() !== userColor) throw new BadRequestException("It's not your turn")


        const timePassed = (Date.now() - game.updatedAt.getTime()) / 1000

        const completeMoves = Math.floor(chess.history().length / 2)
        const userTime = game.gameInfo.clockSeconds[completeMoves - (userColor == "w" ? 1 : 2)][userColor]!
        const newTime = userTime - timePassed
        if (newTime < 0) throw new BadRequestException("Time is up")
        userColor === "w" ?
            game.gameInfo.clockSeconds.push({w: newTime}) :
            game.gameInfo.clockSeconds[completeMoves - 1].b = newTime

        try {
            chess.move(move)
        } catch {
            throw new BadRequestException("Invalid move")
        }
        game.moves = chess.history()
        game.fen = chess.fen()
        game.updatedAt = new Date()

        if (chess.isGameOver()) {
            game.result = chess.isDraw() ? "DRAW" : userColor === "w" ? "WHITE" : "BLACK"

            if (chess.isDraw()) game.reason = chess.isStalemate() ? "STALEMATE" : chess.isThreefoldRepetition() ? "THREEFOLD REPETITION" : "INSUFFICIENT MATERIAL"
            else game.reason = "MATE"
        }

        await this.gameLiveService.saveState(gameId, game)

        return chess.fen()
    }
}