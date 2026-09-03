import LockService from "../domain/interfaces/Lock.service"
import { inject, injectable } from "tsyringe"
import RedisConnection from "../../../infrastructure/cache/RedisConnection"
import { uuidv4 } from "uuidv7"
import LockedException from "../../../shared/exceptions/Locked.exception"

@injectable()
export default class LockRedisService implements LockService {
    constructor(@inject(RedisConnection) private readonly redisConnection: RedisConnection) {}

    async lock(refreshToken: string): Promise<string> {
        const uniqueKey = uuidv4()
        const result = await this.redisConnection.caching!.setNX(`lock:${refreshToken}`, uniqueKey)
        if (!result) {
            throw new LockedException()
        }
        return uniqueKey
    }

    async unlock(refreshToken: string, uniqueKey: string): Promise<void> {
        const script = `
    if redis.call("GET", KEYS[1]) == ARGV[1] then
      return redis.call("DEL", KEYS[1])
    end
    return 0
  `

        await this.redisConnection.caching!.eval(script, {
            keys: [`lock:${refreshToken}`],
            arguments: [uniqueKey],
        })
    }
}
