import { NextFunction, Request, Response } from "express"

const ControllerBuilder = (
    cb: (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown,
) =>
    async function controller(req: Request, res: Response, next: NextFunction) {
        let response
        let nextCalled = false
        const nextAux = (err?: unknown) => {
            if (nextCalled) return
            nextCalled = true
            next(err)
        }
        try {
            response = await cb(req, res, nextAux)
        } catch (e) {
            next(e)
            return
        }
        if (nextCalled) return
        if (res.headersSent) return

        if (response === undefined || response === null) {
            res.status(204).end() // No Content
            return
        }

        if (typeof response === "object") {
            res.status(res.statusCode || 200).json(response)
        } else if (typeof response === "string") {
            res.status(res.statusCode || 200).send(response)
        } else {
            res.status(500).json({ error: "Unexpected response type" })
        }

        return
    }

export default ControllerBuilder
