import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import UserPostgresEntity from "./User.postgres.entity"
import { UserRatingType } from "../../domain/enums/User.Rating.Type.enum"
import UserRating from "../../domain/entity/User.Rating"

@Entity("user_rating")
export default class UserRatingPostgresEntity {
    @PrimaryColumn({
        type: "enum",
        enum: UserRatingType,
    })
    type: UserRatingType

    @PrimaryColumn({ type: "uuid" })
    user_id: string

    @Index()
    @Column({ type: "int", default: 1500 })
    rating: number

    @Column({ type: "float", default: 350 })
    rd: number

    @Column({ type: "float", default: 0.06 })
    volatility: number

    @Column({ type: "int", default: 0 })
    games: number

    @Column({ type: "int", default: 0 })
    win: number

    @Column({ type: "int", default: 0 })
    lose: number

    @Column({ type: "int", default: 0 })
    draw: number

    @ManyToOne(() => UserPostgresEntity, (user) => user.ratings)
    @JoinColumn({ name: "user_id" })
    user: UserPostgresEntity

    static toDomain(entity: UserRatingPostgresEntity): UserRating {
        return new UserRating(
            entity.rating,
            entity.rd,
            entity.volatility,
            entity.games,
            entity.win,
            entity.lose,
            entity.draw,
        )
    }

    static toEntity(type: UserRatingType, userId:string, domain: UserRating): UserRatingPostgresEntity {
        const entity = new UserRatingPostgresEntity()

        entity.user_id = userId
        entity.type = type
        entity.rating = domain.rating
        entity.rd = domain.rd
        entity.volatility = domain.volatility
        entity.games = domain.games
        entity.win = domain.win
        entity.lose = domain.lose
        entity.draw = domain.draw

        return entity
    }
}
