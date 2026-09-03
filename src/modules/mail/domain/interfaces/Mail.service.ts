export default interface MailService {
    sendMail(to: string, subject: string, body: string): Promise<void>

    sendWelcomeMessage(to: string): Promise<void>

    sendCreatePasswordMessage(to: string, uniqueKey: string): Promise<void>
}
