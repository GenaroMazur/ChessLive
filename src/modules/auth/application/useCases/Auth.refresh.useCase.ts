import { inject, injectable } from "tsyringe"
import SessionRepository from "../../domain/interfaces/Session.repository"
import Session from "../../domain/entity/Session"
import ForbiddenException from "../../../../shared/exceptions/Forbidden.exception"
import { ILogger } from "../../../../shared/utils/logger"
import LockService from "../../domain/interfaces/Lock.service"

@injectable()
export default class AuthRefreshUseCase {
    private readonly logger: ILogger

    constructor(
        @inject("SessionRepository") private readonly sessionRepository: SessionRepository,
        @inject("LockService") private readonly lockService: LockService,
        @inject("Logger") logger: ILogger,
    ) {
        this.logger = logger.child("auth_refresh_useCase")
    }

    async execute(oldRefreshToken: string) {
        const lockKey = Session.hashToken(oldRefreshToken)
        const uniqueKey = await this.lockService.lock(lockKey)
        try {
            const oldSession = await this.sessionRepository.findByRefreshToken(lockKey)
            if (!oldSession) throw new ForbiddenException("Invalid refresh token")

            if (oldSession.revokedAt) {
                this.logger.warn(
                    `Possible token theft detected for family, revoking all sessions, userId: ${oldSession.userId}`,
                )
                await this.sessionRepository.revokeByFamily(oldSession.family)
                throw new ForbiddenException("Invalid refresh token")
            }

            if (oldSession.isExpired()) throw new ForbiddenException("Expired refresh token")

            oldSession.revokedAt = new Date()

            const { session, refreshToken } = oldSession.refresh()
            await this.sessionRepository.saveAll([session, oldSession])

            return { session, refreshToken }
        } finally {
            await this.lockService.unlock(lockKey, uniqueKey)
        }
    }
}
