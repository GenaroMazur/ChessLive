import validationHandlerMiddleware from "./validationHandlerMiddleware"
import { param } from "express-validator"

export const ValidUUIDParamMiddleware = [param("id").isUUID(), validationHandlerMiddleware]
