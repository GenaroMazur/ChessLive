import UserCreateDto from "../dtos/User.create.dto"
import User from "../../domain/entity/User"
import { inject, injectable } from "tsyringe"
import UserRepository from "../../domain/interfaces/User.repository"
import EncryptService from "../../domain/interfaces/Encrypt.service"
import { uuidv7 } from "uuidv7"
import UserValidationException from "../../domain/exceptions/User.validation.exception"

@injectable()
export default class UserCreateUseCase {
    constructor(
        @inject("UserRepository") private readonly userRepository: UserRepository,
        @inject("EncryptService") private readonly encryptService: EncryptService,
    ) {}

    async execute(dto: UserCreateDto) {
        const user = new User()

        user.id = uuidv7()
        user.username = dto.username
        user.email = dto.email
        user.confirmedEmail = false
        user.password = await this.encryptService.encrypt(dto.password)
        user.profile = {
            firstName: dto.firstName,
            lastName: dto.lastName,
        }

        const [existsEmail, existsUsername] = await Promise.all([
            this.userRepository.findByEmail(dto.email),
            this.userRepository.findByUsername(dto.username),
        ])

        if (existsEmail) throw new UserValidationException("El correo ya existe")

        if (existsUsername) throw new UserValidationException("El nombre de usuario ya existe")

        return this.userRepository.save(user)
    }
}
