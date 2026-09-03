import { Column, Entity, PrimaryColumn } from "typeorm"
import Session from "../../domain/entity/Session"

@Entity()
export default class SessionPostgresEntity {
    @PrimaryColumn("varchar")
    refreshToken: string

    @Column("uuid")
    user_id: string

    @Column("uuid")
    family: string

    @Column("timestamp")
    loginAt: Date

    @Column("timestamp")
    expiredAt: Date

    @Column("timestamp", { nullable: true })
    revokedAt: Date | null

    static toDomain(entity: SessionPostgresEntity): Session {
        const domain = new Session()
        domain.refreshToken = entity.refreshToken
        domain.userId = entity.user_id
        domain.family = entity.family
        domain.loginAt = entity.loginAt
        domain.expiredAt = entity.expiredAt
        domain.revokedAt = entity.revokedAt
        return domain
    }

    static toEntity(domain: Session): SessionPostgresEntity {
        const entity = new SessionPostgresEntity()
        entity.refreshToken = domain.refreshToken
        entity.user_id = domain.userId
        entity.family = domain.family
        entity.loginAt = domain.loginAt
        entity.expiredAt = domain.expiredAt
        entity.revokedAt = domain.revokedAt
        return entity
    }
}
