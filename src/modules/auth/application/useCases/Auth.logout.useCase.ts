import { inject, injectable } from "tsyringe"
import SessionRepository from "../../domain/interfaces/Session.repository"
import UnauthorizedException from "../../../../shared/exceptions/Unauthorized.exception"
import Session from "../../domain/entity/Session"

@injectable()
export default class AuthLogoutUseCase {
    constructor(
        @inject("SessionRepository") private readonly sessionRepository: SessionRepository,
    ) {}

    async execute(refreshToken: string) {
        const session = await this.sessionRepository.findByRefreshToken(
            Session.hashToken(refreshToken),
        )
        if (!session) throw new UnauthorizedException("Invalid refresh token")

        await this.sessionRepository.revokeByFamily(session.family)
    }
}
