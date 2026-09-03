import { inject, injectable } from "tsyringe"
import ControllerBuilder from "../../../../shared/utils/controllerBuilder"
import AuthLoginUseCase from "../../application/useCases/Auth.login.useCase"
import AuthRegisterUseCase from "../../application/useCases/Auth.register.useCase"
import AuthRefreshUseCase from "../../application/useCases/Auth.refresh.useCase"
import AuthLoginDto from "../../application/dtos/Auth.login.dto"
import Context from "../../../../shared/entity/Context"
import TokenJwt from "../Token.jwt"
import UserCreateDto from "../../../user/application/dtos/User.create.dto"
import AuthLogoutUseCase from "../../application/useCases/Auth.logout.useCase"

@injectable()
export default class AuthController {
    constructor(
        @inject(AuthLoginUseCase) private readonly loginUseCase: AuthLoginUseCase,
        @inject(AuthRegisterUseCase) private readonly registerUseCase: AuthRegisterUseCase,
        @inject(AuthRefreshUseCase) private readonly refreshUseCase: AuthRefreshUseCase,
        @inject(AuthLogoutUseCase) private readonly logoutUseCase: AuthLogoutUseCase,
        @inject(TokenJwt) private readonly tokenJwt: TokenJwt,
    ) {}

    readonly login = ControllerBuilder(async ({ body, ip, headers }, res) => {
        const { session, refreshToken } = await this.loginUseCase.execute(new AuthLoginDto(body))

        const context = new Context()

        context.userId = session.userId
        context.ipAddr = ip ?? ""
        context.userAgent = headers["user-agent"] ?? ""
        context.contextExpire = new Date(new Date().getTime() + Context.EXPIRATION_SECONDS * 1000)
        context.sessionExpire = session.expiredAt

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
            path: "/auth",
            sameSite: "none",
            expires: context.sessionExpire,
        })

        const accessToken = this.tokenJwt.generate(context)

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            expires: context.sessionExpire,
        })

        return context
    })
    readonly register = ControllerBuilder(async ({ body }, res) => {
        res.statusCode = 201
        return await this.registerUseCase.execute(new UserCreateDto(body))
    })

    readonly refresh = ControllerBuilder(async ({ cookies, ip, headers }, res) => {
        const actualRefreshToken = cookies.refresh_token

        const { session, refreshToken } = await this.refreshUseCase.execute(actualRefreshToken)

        const context = new Context()

        context.userId = session.userId
        context.ipAddr = ip ?? ""
        context.userAgent = headers["user-agent"] ?? ""
        context.contextExpire = new Date(new Date().getTime() + Context.EXPIRATION_SECONDS * 1000)
        context.sessionExpire = session.expiredAt

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
            path: "/auth",
            sameSite: "none",
            expires: context.sessionExpire,
        })

        const accessToken = this.tokenJwt.generate(context)

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            expires: context.sessionExpire,
        })

        return context
    })

    logout = ControllerBuilder(async ({ cookies }, res) => {
        const actualRefreshToken = cookies.refresh_token

        await this.logoutUseCase.execute(actualRefreshToken)

        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: true,
            path: "/auth",
            sameSite: "none",
        })

        res.clearCookie("access_token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
    })
}
