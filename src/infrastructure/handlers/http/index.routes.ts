import controllerBuilder from "../../../shared/utils/controllerBuilder"
import {Router, IRouter} from "express"

const indexRouter: IRouter = Router()

indexRouter.get(
    "/",
    controllerBuilder(() => "OK"),
)

export default indexRouter
