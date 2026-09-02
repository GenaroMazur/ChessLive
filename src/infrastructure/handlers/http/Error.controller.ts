import {NextFunction, Response} from "express"
import SystemException from "../../../shared/exceptions/System.exception"
import {baseLogger} from "../../../shared/utils/logger"
import UserException from "../../../shared/exceptions/User.exception"

const ErrorController = (err: SystemException, _: unknown, res: Response, next: NextFunction) => {
    const NODE_ENV = process.env.NODE_ENV?.toLowerCase() == "development"

    if (res.headersSent) {
        baseLogger.error(err)
        return next(err)
    }

    // eslint-disable-next-line
    // @ts-ignore
    if (err.status === 400 && err.type === "entity.parse.failed")
        return res.status(400).send({message: "Invalid JSON payload passed."})

    if (err instanceof UserException)
        return res.status(err.code || 400).send({message: err.message, ...err.body})

    baseLogger.error(err)
    res.status(500).send({
        error: NODE_ENV ? err.message : "Internal server error.",
        stack: NODE_ENV ? err.stack : undefined,
        body: NODE_ENV ? err.body : undefined,
    })
}

export default ErrorController
