import {UserRatingType} from "../../modules/user/domain/enums/User.Rating.Type.enum";

export default class TimeControl {
    type: UserRatingType
    timeInSeconds: number
    incrementInSeconds: number

    constructor(type: UserRatingType, timeInSeconds: number, incrementInSeconds: number) {
        this.type = type
        this.timeInSeconds = timeInSeconds
        this.incrementInSeconds = incrementInSeconds
    }

    /**
     * @param time format: <minutes>+<seconds>
     */
    static fromString(time: string): TimeControl {
        const [timeInSeconds, incrementInSeconds] = time.split("+").map(Number)

        if (isNaN(timeInSeconds) || isNaN(incrementInSeconds)) {
            throw new Error("Invalid time format")
        }

        let type: UserRatingType

        if (timeInSeconds < 60 * 3)
            type = UserRatingType.Bullet
        else if (timeInSeconds < 60 * 10)
            type = UserRatingType.Blitz
        else if (timeInSeconds < 60 * 60)
            type = UserRatingType.Rapid
        else
            type = UserRatingType.Classical

        return new TimeControl(type, timeInSeconds * 60, incrementInSeconds)
    }

    toString(): string {
        return `${this.timeInSeconds / 60}+${this.incrementInSeconds}`
    }
}