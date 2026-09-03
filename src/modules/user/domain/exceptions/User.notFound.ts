import NotFoundException from "../../../../shared/exceptions/NotFound.exception"

export default class UserNotFound extends NotFoundException {
    constructor() {
        super("User not found")
    }
}
