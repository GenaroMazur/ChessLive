import {inject, injectable} from "tsyringe";
import QueueService from "../../domain/interfaces/Queue.service";
import Context from "../../../../shared/entity/Context";
import UnauthorizedException from "../../../../shared/exceptions/Unauthorized.exception";

@injectable()
export default class LiveCancelUseCase {
    constructor(
        @inject("QueueService") private readonly queueService: QueueService
    ) {
    }

    async execute(context: Context, queueId: string) {
        const [timeControl, member] = queueId.split("@")

        if (member !== context.userId) throw new UnauthorizedException()

        this.queueService.delQueue(timeControl, member)
    }
}