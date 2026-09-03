import {inject, injectable} from "tsyringe";
import Context from "../../../../shared/entity/Context";
import UserRepository from "../../../user/domain/interfaces/User.repository";
import UnauthorizedException from "../../../../shared/exceptions/Unauthorized.exception";
import TimeControl from "../../../../shared/entity/TimeControl";
import UserRating from "../../../user/domain/entity/User.Rating";
import QueueService from "../../domain/interfaces/Queue.service";

@injectable()
export default class LiveSearchUseCase {
    constructor(
        @inject("UserRepository") private readonly userRepository: UserRepository,
        @inject("QueueService") private readonly queueService: QueueService
    ) {
    }

    async execute(context: Context, timeControl: TimeControl) {
        const user = await this.userRepository.findById(context.userId)
        if (!user)
            throw new UnauthorizedException()

        if (!user.ratings[timeControl.type]) {
            user.ratings[timeControl.type] = new UserRating()
            await this.userRepository.save(user)
        }

        const member = await this.queueService.setQueue(timeControl.toString(), user.ratings[timeControl.type]!.rating, user.id)

        return `${timeControl.toString()}@${member}`
    }
}