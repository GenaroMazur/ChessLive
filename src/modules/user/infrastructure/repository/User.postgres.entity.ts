import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm"
import UserRatingPostgresEntity from "./User.Rating.postgres.entity"
import User from "../../domain/entity/User"
import { UserRatingType } from "../../domain/enums/User.Rating.Type.enum"

@Entity("user")
export default class UserPostgresEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column("varchar", { unique: true })
    username: string

    @Column("varchar", { unique: true })
    email: string

    @Column("varchar", { name: "confirm_email", default: false })
    confirmedEmail: boolean

    @Column("varchar")
    password: string

    @Column("jsonb", { default: {} })
    profile: {
        firstName?: string
        lastName?: string
        avatarUrl?: string
    }

    @OneToMany(() => UserRatingPostgresEntity, (rating) => rating.user, {cascade:true})
    ratings: UserRatingPostgresEntity[]

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date

    static toDomain(entity: UserPostgresEntity): User {
        const user = new User()

        user.id = entity.id
        user.username = entity.username
        user.email = entity.email
        user.confirmedEmail = entity.confirmedEmail
        user.password = entity.password
        user.createdAt = entity.createdAt
        user.updatedAt = entity.updatedAt
        user.profile = entity.profile

        entity.ratings.forEach((rating) => {
            if(!user.ratings) user.ratings = {} as any
            user.ratings[rating.type] = UserRatingPostgresEntity.toDomain(rating)
        })

        return user
    }

    static toEntity(domain: User): UserPostgresEntity {
        const user = new UserPostgresEntity()

        user.id = domain.id
        user.username = domain.username
        user.email = domain.email
        user.confirmedEmail = domain.confirmedEmail
        user.password = domain.password
        user.createdAt = domain.createdAt
        user.updatedAt = domain.updatedAt
        user.profile = domain.profile

        user.ratings = domain.ratings
            ? Object.entries(domain.ratings).map(([type, rating]) =>
                  UserRatingPostgresEntity.toEntity(type as UserRatingType, user.id, rating),
              )
            : []

        return user
    }
}
