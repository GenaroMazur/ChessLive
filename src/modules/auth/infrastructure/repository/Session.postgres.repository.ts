import Session from "../../domain/entity/Session"
import SessionRepository from "../../domain/interfaces/Session.repository"
import { inject, injectable } from "tsyringe"
import { Repository } from "typeorm"
import PostgresConnection from "../../../../infrastructure/PostgresConnection"
import SessionPostgresEntity from "./Session.postgres.entity"

@injectable()
export default class SessionPostgresRepository implements SessionRepository {
    private readonly repository: Repository<SessionPostgresEntity>

    constructor(@inject("DataSource") datasource: PostgresConnection) {
        this.repository = datasource.datasource.getRepository(SessionPostgresEntity)
    }

    async revokeByFamily(family: string): Promise<void> {
        await this.repository.update({ family }, { revokedAt: new Date() })
    }

    async findByRefreshToken(refreshToken: string): Promise<Session | null> {
        const session = await this.repository.findOneBy({ refreshToken })

        return session ? SessionPostgresEntity.toDomain(session) : null
    }

    async saveAll(session: Session[]): Promise<void> {
        await this.repository.save(session.map(SessionPostgresEntity.toEntity))
    }

    async save(domain: Session): Promise<Session> {
        const entity = SessionPostgresEntity.toEntity(domain)
        await this.repository.save(entity)

        return SessionPostgresEntity.toDomain(entity)
    }

    async findById(refreshToken: string): Promise<Session | null> {
        const session = await this.repository.findOneBy({ refreshToken })

        return session ? SessionPostgresEntity.toDomain(session) : null
    }

    async delete(id: string | Session): Promise<void> {
        const session = id instanceof Session ? id.refreshToken : id

        await this.repository.delete(session)
    }
}
