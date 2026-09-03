import { inject, injectable } from "tsyringe"
import UserRepository from "../../../user/domain/interfaces/User.repository"
import EncryptService from "../../../user/domain/interfaces/Encrypt.service"
import AuthLoginDto from "../dtos/Auth.login.dto"
import UnauthorizedException from "../../../../shared/exceptions/Unauthorized.exception"
import Session from "../../domain/entity/Session"
import { uuidv7 } from "uuidv7"
import SessionRepository from "../../domain/interfaces/Session.repository"

@injectable()
export default class AuthLoginUseCase {
    constructor(
        @inject("UserRepository") private readonly userRepository: UserRepository,
        @inject("EncryptService") private readonly encryptService: EncryptService,
        @inject("SessionRepository") private readonly sessionRepository: SessionRepository,
    ) {}

    async execute(dto: AuthLoginDto) {
        const user = await this.userRepository.findByUsernameOrEmail(dto.identity)
        if (!user) throw new UnauthorizedException("Credenciales invalidas")

        if (!(await this.encryptService.compare(dto.password, user.password)))
            throw new UnauthorizedException("Credenciales invalidas")

        const session = new Session()

        const refreshToken = Session.generateOpaqueToken()

        session.refreshToken = Session.hashToken(refreshToken)
        session.family = uuidv7()
        session.userId = user.id
        session.revokedAt = null
        session.expiredAt = new Date(new Date().getTime() + Session.EXPIRATION_SECONDS * 1000)
        session.loginAt = new Date()

        await this.sessionRepository.save(session)

        return { session, refreshToken, user }
    }
}
