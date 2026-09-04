import {inject, injectable} from "tsyringe";
import GameLiveService from "../../domain/interfaces/GameLive.service";
import Game from "../../domain/entity/Game";
import Context from "../../../../shared/entity/Context";

@injectable()
export default class LiveGetStateUseCase {
    constructor(@inject("GameLiveService") private readonly gameLiveService: GameLiveService) {
    }

    async execute(context: Context, gameId: string): Promise<Game | null> {
        const game = await this.gameLiveService.getState(gameId);

        if (!game) return null

        if (game.whitePlayerId !== context.userId &&
            game.blackPlayerId !== context.userId) return null

        return game
    }
}