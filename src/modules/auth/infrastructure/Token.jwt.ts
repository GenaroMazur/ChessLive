import jwt from "jsonwebtoken"
import { logger } from "../../../shared/utils/logger"
import { injectable } from "tsyringe"
import Context from "../../../shared/entity/Context"
import AccessToken from "./AccessToken"

@injectable()
export default class TokenJwt {
    private readonly secret: string

    constructor() {
        this.secret = process.env.JWT_SECRET || "default_secret"
        if (!process.env.JWT_SECRET)
            logger.warn("JWT_SECRET not found, using default_secret, please set it in .env file")
    }

    generate(payload: Context): string {
        return jwt.sign({ ...AccessToken.fromContext(payload) }, this.secret)
    }

    /**
     * Verifica la validez del token, incluyendo firma y fecha de expiración
     */
    verify(token: string, ignoreExpiration: boolean = false): AccessToken {
        return new AccessToken(jwt.verify(token, this.secret, { ignoreExpiration }) as AccessToken)
    }
}
