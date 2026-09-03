import nodemailer from "nodemailer"
import MailService from "../../domain/interfaces/Mail.service"
import { htmlRecoveryPassword, htmlWelcomeMessage } from "../forgotPassword.utils"
import { ILogger } from "../../../../shared/utils/logger"
import { inject } from "tsyringe"

export default class NodemailerMailService implements MailService {
    private transporter: nodemailer.Transporter

    private readonly logger: ILogger

    constructor(@inject("Logger") logger: ILogger) {
        this.logger = logger.child("Mail_Service")
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        })
    }

    async sendWelcomeMessage(to: string): Promise<void> {
        await this.sendMail(to, "Bienvenido a la plataforma", htmlWelcomeMessage())
    }

    async sendCreatePasswordMessage(to: string, uniqueKey: string): Promise<void> {
        await this.sendMail(to, "Crea tu contraseña", htmlRecoveryPassword(uniqueKey))
    }

    async sendMail(to: string, subject: string, body: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: process.env.MAIL_USER,
                to,
                subject,
                html: body, // Podríamos mejorar esto para soportar HTML opcionalmente
            })
            this.logger.info(`Correo enviado exitosamente a: ${to}`)
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw error
        }
    }
}
