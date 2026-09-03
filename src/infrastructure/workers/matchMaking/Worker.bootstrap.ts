import "reflect-metadata"
import RedisConnection from "../../cache/RedisConnection";
import MatchmakingCron from "./Matchmaking.cron";
import GetEnv from "../../../shared/utils/getEnv";
import {logger} from "../../../shared/utils/logger";
import QueueRedisService from "../../../modules/live/infrastructure/Queue.redis.service";

async function bootstrapWorker() {
    const REDIS_URL = GetEnv("REDIS_URL", true)
    const workerLogger = logger.child("Matchmaker_Worker_Process");

    const redis = new RedisConnection(REDIS_URL, workerLogger);
    await redis.start();

    workerLogger.info("Iniciando Worker de Matchmaking...");

    const queueRedisService = new QueueRedisService(redis)

    const matchmaker = new MatchmakingCron(queueRedisService, workerLogger);

    matchmaker.on("matchFound", (game) => {
        workerLogger.info(`¡Partida creada! GameID: ${game.id} | Jugadores: ${game.whitePlayerId} vs ${game.blackPlayerId}`);
        redis.caching!.set(`games:${game.id}`, JSON.stringify(game))
        redis.caching!.publish(`matches`, `games:${game.id}`)
    });

    matchmaker.start();

    const shutdown = async (signal: string) => {
        workerLogger.info(`Recibida señal ${signal}. Deteniendo Worker...`);

        matchmaker.stop();
        await redis.stop();

        workerLogger.info("Worker detenido correctamente.");
        process.exit(0);
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
}

bootstrapWorker().catch((error) => {
    console.error("Error fatal en el Worker de Matchmaking:", error);
    process.exit(1);
});