import UserException from "./User.exception"

export default class LockedException extends UserException {
    constructor(message?: string) {
        super(message || "Se está utilizando el recurso")
        this.name = "LockedException"
        this.code = 423
        Object.setPrototypeOf(this, LockedException.prototype)
    }
}
