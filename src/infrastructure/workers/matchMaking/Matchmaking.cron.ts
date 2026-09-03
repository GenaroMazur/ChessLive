import {inject, injectable} from "tsyringe";
import {EventEmitter} from "node:events";
import QueueService from "../../../modules/live/domain/interfaces/Queue.service";
import QueueElement from "../../../modules/live/domain/entity/QueueElement";
import {uuidv7} from "uuidv7";
import {clearTimeout} from "node:timers";
import {baseLogger, ILogger} from "../../../shared/utils/logger";
import Game from "../../../modules/game/domain/entity/Game";

@injectable()
/**
 * Event matchFound params: [gameId, player1Id, player2Id]
 */
export default class MatchmakingCron extends EventEmitter<{
    matchFound: [Game]
}> {
    private cron: NodeJS.Timeout | null = null
    private readonly logger: ILogger

    constructor(
        @inject("QueueService") private readonly queueService: QueueService,
        @inject("Logger") logger: ILogger
    ) {
        super()
        this.logger = logger.child("Matchmaking_Cron")
    }

    start() {
        if (this.cron) return
        this.scheduleNext()
    }

    stop() {
        if (this.cron) clearTimeout(this.cron)
        this.cron = null
    }

    private scheduleNext() {
        this.cron = setTimeout(async () => {
            try {
                this.logger.debug("process")
                await this.process()
            } catch (e) {
                this.logger.error("scheduleNext: ")
                baseLogger.error(e)
            } finally {
                if (this.cron) this.scheduleNext()
            }
        }, 500)
    }

    private async process() {
        const timeControls = await this.queueService.getTimeControls()

        for (const timeControl of timeControls) {
            const members = await this.queueService.getBatchMembers(timeControl, 100)
            const sortedMembers = members
                .sort((a, b) => a.timestamp - b.timestamp)

            for (const member of sortedMembers) {
                if (member.processed) continue

                const bestMatch = this.findFirstValidMatch(member, sortedMembers)
                if (!bestMatch) continue
                const deleted = await this.queueService.delTwoMembers(timeControl, member.member, bestMatch.member)

                if (!deleted) continue

                bestMatch.processed = true
                member.processed = true

                await this.matchCreate(timeControl, member, bestMatch)
            }
        }
    }

    private async matchCreate(timeControl: string, member1: QueueElement, member2: QueueElement) {
        const game = new Game()

        game.id = uuidv7()
        game.whitePlayerId = member1.userId
        game.blackPlayerId = member2.userId
        game.gameInfo = {clock: []}
        game.moves = []
        game.timeControl = timeControl
        game.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        game.createdAt = new Date()

        this.emit("matchFound", game)
    }

    private findFirstValidMatch(player: QueueElement, candidates: QueueElement[]): QueueElement | undefined {
        const playerWindow = player.calculateEloWindow()

        return candidates.find(candidate => {
            if (candidate.userId === player.userId || candidate.processed) return false

            const candidateWindow = candidate.calculateEloWindow()

            const fitsInPlayerWindow =
                candidate.elo >= player.elo - playerWindow &&
                candidate.elo <= player.elo + playerWindow

            const fitsInCandidateWindow =
                player.elo >= candidate.elo - candidateWindow &&
                player.elo <= candidate.elo + candidateWindow

            return fitsInPlayerWindow && fitsInCandidateWindow
        })
    }
}