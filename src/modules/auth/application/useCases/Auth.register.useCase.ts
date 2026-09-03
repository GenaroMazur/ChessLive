import { inject, injectable } from "tsyringe"
import MailService from "../../../mail/domain/interfaces/Mail.service"
import UserCreateDto from "../../../user/application/dtos/User.create.dto"
import UserCreateUseCase from "../../../user/application/useCases/User.create.useCase"

@injectable()
export default class AuthRegisterUseCase {
    constructor(
        @inject("MailService") private readonly mailService: MailService,
        @inject(UserCreateUseCase) private readonly userCreateUseCase: UserCreateUseCase,
    ) {}

    async execute(dto: UserCreateDto) {
        const user = await this.userCreateUseCase.execute(dto)

        await this.mailService.sendWelcomeMessage(user.email)

        return user
    }
}
