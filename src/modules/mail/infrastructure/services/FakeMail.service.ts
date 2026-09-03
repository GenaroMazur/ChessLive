import MailService from "../../domain/interfaces/Mail.service"
import { ILogger } from "../../../../shared/utils/logger"
import { inject, injectable } from "tsyringe"

@injectable()
export default class FakeMailService implements MailService {
    private readonly logger: ILogger

    constructor(@inject("Logger") logger: ILogger) {
        this.logger = logger.child("FAKE-Mail-Service")
    }

    async sendWelcomeMessage(to: string): Promise<void> {
        this.logger.info(`Simulando envío de correo de bienvenida a: ${to}`)
    }

    async sendCreatePasswordMessage(to: string, _: string): Promise<void> {
        this.logger.info(`Simulando envío de correo de creación de contraseña a: ${to}`)
    }

    async sendMail(to: string, subject: string, body: string): Promise<void> {
        this.logger.info(`Simulando envío de correo a: ${to}`)
        this.logger.info(`Asunto: ${subject}`)
        this.logger.info(`Cuerpo: ${body}`)
    }
}
