import { validationResult } from "express-validator"
import BadRequestException from "../exceptions/BadRequest.exception"
import ControllerBuilder from "./controllerBuilder"

const validationHandlerMiddleware = ControllerBuilder(async (req, _, next) => {
    const errors = validationResult(req)

    if (errors.isEmpty()) return next()

    next(new BadRequestException("Validation Error", { errors: errors.mapped() }))
})

export default validationHandlerMiddleware
