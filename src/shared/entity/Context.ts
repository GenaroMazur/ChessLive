export default class Context {
    static EXPIRATION_SECONDS = 60 * 15 // 15 minutes

    userId: string
    ipAddr: string
    userAgent: string

    sessionExpire: Date
    contextExpire: Date
}
