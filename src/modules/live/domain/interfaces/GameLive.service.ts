import Game from "../entity/Game";

export default interface GameLiveService {
    getState(gameId: string): Promise<Game | null>;

    saveState(gameId: string, state: Game): Promise<void>;

    delState(gameId: string): Promise<void>;
}