import QueueElement from "../domain/entity/QueueElement";
import QueueService from "../domain/interfaces/Queue.service";
import RedisConnection from "../../../infrastructure/cache/RedisConnection";
import {inject, injectable} from "tsyringe";

@injectable()
export default class QueueRedisService implements QueueService {
    constructor(@inject(RedisConnection) private readonly redisConnection: RedisConnection) {
    }

    get cache() {
        return this.redisConnection.caching!
    }

    async setQueue(timeControl: string, elo: number, userId: string): Promise<string> {
        // Guardamos la estructura member con userId y el timestamp de entrada
        const timestamp = Date.now();
        const member = `${userId}:${timestamp}`;
        await this.cache.zAdd(`queue:${timeControl}`, [{score: elo, value: member}]);
        return member;
    }

    async delQueue(timeControl: string, member: string): Promise<void> {
        await this.cache.zRem(`queue:${timeControl}`, member);
    }

    async getBatchMembers(timeControl: string, batchSize: number): Promise<QueueElement[]> {
        // Obtenemos los elementos del Sorted Set
        const members = await this.cache.zRangeWithScores(`queue:${timeControl}`, 0, batchSize - 1);

        return members.map(({score, value}) => {
            const [userId, timestampStr] = value.split(":");
            const timestamp = parseInt(timestampStr, 10);

            return new QueueElement(score, userId, timestamp, value);
        });
    }

    async delTwoMembers(timeControl: string, member1: string, member2: string): Promise<boolean> {
        // Script Lua para garantizar la eliminación atómica de ambos miembros
        const luaScript = `
            local score1 = redis.call('ZSCORE', KEYS[1], ARGV[1])
            local score2 = redis.call('ZSCORE', KEYS[1], ARGV[2])
            if score1 and score2 then
                redis.call('ZREM', KEYS[1], ARGV[1], ARGV[2])
                return 1
            else
                return 0
            end
        `;

        const result = await this.cache.eval(luaScript, {
            keys: [`queue:${timeControl}`],
            arguments: [member1, member2]
        });

        return result === 1;
    }

    async getTimeControls(): Promise<string[]> {
        const keys = await this.cache.keys("queue:*");
        return keys.map(key => key.replace("queue:", ""));
    }
}