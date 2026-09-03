import User from "../../domain/entity/User"
import UserRepository from "../../domain/interfaces/User.repository"
import { inject, injectable } from "tsyringe"
import PostgresConnection from "../../../../infrastructure/PostgresConnection"
import { Repository } from "typeorm"
import UserPostgresEntity from "./User.postgres.entity"

@injectable()
export default class UserPostgresRepository implements UserRepository {
    private readonly repository: Repository<UserPostgresEntity>

    constructor(@inject("DataSource") datasource: PostgresConnection) {
        this.repository = datasource.datasource.getRepository(UserPostgresEntity)
    }

    async findByUsername(username: string): Promise<User | null> {
        const user = await this.repository.findOne({
            where: { username },
            relations: { ratings: true },
        })

        return user ? UserPostgresEntity.toDomain(user) : null
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.repository.findOne({
            where: { email },
            relations: { ratings: true },
        })

        return user ? UserPostgresEntity.toDomain(user) : null
    }

    async findByUsernameOrEmail(identity: string): Promise<User | null> {
        const user = await this.repository.findOne({
            where: [{ username: identity }, { email: identity }],
            relations: { ratings: true },
        })

        return user ? UserPostgresEntity.toDomain(user) : null
    }

    async save(domain: User): Promise<User> {
        const entity = UserPostgresEntity.toEntity(domain)
        const savedEntity = await this.repository.save(entity)

        return UserPostgresEntity.toDomain(savedEntity)
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.repository.findOne({ where: { id }, relations: { ratings: true } })

        return user ? UserPostgresEntity.toDomain(user) : null
    }

    async delete(id: string | User): Promise<void> {
        const entity = id instanceof User ? UserPostgresEntity.toEntity(id) : id
        await this.repository.delete(entity)
    }
}
