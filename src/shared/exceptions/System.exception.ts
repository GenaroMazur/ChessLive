export default class SystemException extends Error {
    body?: object

    constructor(message: string, body?: object) {
        super(message)
        this.name = "systemException"
        this.body = body
        Object.setPrototypeOf(this, SystemException.prototype)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SystemException)
        }
    }
}
