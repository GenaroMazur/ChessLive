import { Router } from "express"
import AuthController from "./Auth.controller"
import { container } from "tsyringe"

const AuthRouter = Router()

const authController = container.resolve(AuthController)

AuthRouter.post("/login", authController.login)
AuthRouter.post("/refresh", authController.refresh)
AuthRouter.post("/logout", authController.logout)
AuthRouter.post("/register", authController.register)

export default AuthRouter
