import crypto from "crypto"

export default class Session {
    static EXPIRATION_SECONDS = 60 * 60 * 24 * 7 // 1 week

    refreshToken: string
    userId: string
    family: string
    loginAt: Date
    expiredAt: Date
    revokedAt: Date | null

    refresh() {
        const session = new Session()

        const refreshToken = Session.generateOpaqueToken()

        session.refreshToken = Session.hashToken(refreshToken)
        session.userId = this.userId
        session.family = this.family
        session.loginAt = this.loginAt
        session.expiredAt = this.expiredAt
        session.revokedAt = null

        return { session, refreshToken }
    }

    isExpired() {
        return this.expiredAt < new Date()
    }

    static hashToken(token: string) {
        return crypto.createHash("sha256").update(token).digest("hex")
    }

    static generateOpaqueToken() {
        return crypto.randomBytes(64).toString("hex")
    }
}
