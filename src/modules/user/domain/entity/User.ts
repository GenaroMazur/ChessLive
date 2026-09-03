import UserRating from "./User.Rating"
import { UserRatingType } from "../enums/User.Rating.Type.enum"

export default class User {
    id: string
    username: string
    email: string
    confirmedEmail: boolean
    password: string

    profile: {
        firstName?: string
        lastName?: string
        avatarUrl?: string
    }

    ratings: Partial<Record<UserRatingType, UserRating>>

    createdAt: Date
    updatedAt: Date

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            confirmedEmail: this.confirmedEmail,
            profile: this.profile,
            ratings: this.ratings,
        }
    }
}
