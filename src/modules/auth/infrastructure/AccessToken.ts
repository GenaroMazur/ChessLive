import Context from "../../../shared/entity/Context"

/**
 * @property {number} iat - Cuando fue creado
 * @property {number} exp - Cuando expira el contexto
 * @property {number} sessionExp - Cuando expira la sesion
 * @property {string} sub - Id del usuario
 */
export default class AccessToken {
    iat: number
    exp: number
    sessionExp: number

    sub: string

    static fromContext(context: Context) {
        const accessToken = new AccessToken()

        accessToken.iat = new Date().getTime() / 1000
        accessToken.exp = context.contextExpire.getTime() / 1000
        accessToken.sessionExp = context.sessionExpire.getTime() / 1000
        accessToken.sub = context.userId

        return accessToken
    }

    constructor(accessToken?: AccessToken) {
        if (accessToken) {
            this.iat = accessToken.iat
            this.exp = accessToken.exp
            this.sessionExp = accessToken.sessionExp
            this.sub = accessToken.sub
        }
    }
}
