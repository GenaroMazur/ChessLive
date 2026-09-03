import ConflictException from "../../../../shared/exceptions/Conflict.exception"

export default class UserValidationException extends ConflictException {
    constructor(err: string) {
        super(`Error al validar el usuario: ${err}`)
    }
}
