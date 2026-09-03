import controllerBuilder from "../../../shared/utils/controllerBuilder"
import { Router, IRouter } from "express"
import authRouter from "../../../modules/auth/infrastructure/http/Auth.router"

const indexRouter: IRouter = Router()

indexRouter.get(
    "/",
    controllerBuilder(() => "OK"),
)

indexRouter.use("/auth", authRouter)

export default indexRouter
