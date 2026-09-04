import "reflect-metadata"
import { parentPort } from "node:worker_threads"
import RedisConnection from "../../cache/RedisConnection"
import MatchmakingCron from "./Matchmaking.cron"
import GetEnv from "../../../shared/utils/getEnv"
import { baseLogger, logger } from "../../../shared/utils/logger"
import QueueRedisService from "../../../modules/live/infrastructure/Queue.redis.service"

/**
 * Entry point for the matchmaking worker thread.
 *
 * IMPORTANT: this file only makes sense running inside a `worker_threads.Worker`
 * spawned by `WorkerManager`. Worker threads do NOT receive OS signals
 * (SIGINT/SIGTERM) - those are only delivered to the main thread - so shutdown
 * is coordinated exclusively through `parentPort` messages, matching the
 * protocol `WorkerManager` speaks (`{ type: "STOP" }` in, `exit` event out).
 */

const workerLogger = logger.child("Matchmaker_Worker_Process")

async function bootstrapWorker() {
    if (!parentPort) {
        throw new Error("Worker.bootstrap must be run as a worker_thread (parentPort is null)")
    }

    const REDIS_URL = GetEnv("REDIS_URL", true)

    const redis = new RedisConnection(REDIS_URL, workerLogger)
    await redis.start()

    workerLogger.info("Iniciando Worker de Matchmaking...")

    const queueRedisService = new QueueRedisService(redis)
    const matchmaker = new MatchmakingCron(queueRedisService, workerLogger)

    matchmaker.on("matchFound", (game) => {
        workerLogger.info(
            `¡Partida creada! GameID: ${game.id} | Jugadores: ${game.whitePlayerId} vs ${game.blackPlayerId}`,
        )

        redis.caching!
            .set(`games:${game.id}`, JSON.stringify(game))
            .then(() => redis.caching!.publish("matches", `games:${game.id}`))
            .catch((err) => {
                workerLogger.error(`Error al publicar la partida ${game.id}:`)
                baseLogger.error(err)
            })
    })

    let shuttingDown = false

    const shutdown = async (reason: string) => {
        if (shuttingDown) return
        shuttingDown = true

        workerLogger.info(`Deteniendo Worker de Matchmaking (${reason})...`)

        try {
            matchmaker.stop()
            await redis.stop()
            workerLogger.info("Worker detenido correctamente.")
            process.exit(0)
        } catch (err) {
            workerLogger.error("Error al detener el Worker:")
            baseLogger.error(err)
            process.exit(1)
        }
    }

    // Protocol expected by WorkerManager: it posts { type: "STOP" } and waits
    // for this thread to exit before resolving `WorkerManager.stop()`.
    parentPort.on("message", (msg) => {
        if (msg?.type === "STOP") void shutdown("STOP message")
    })

    // Defensive fallback: if the worker thread ever gets orphaned without a
    // parent to message it (should not normally happen), don't hang forever.
    parentPort.on("close", () => void shutdown("parent port closed"))

    matchmaker.start()

    workerLogger.info("Worker de Matchmaking listo.")
}

bootstrapWorker().catch((error) => {
    baseLogger.error("Error fatal en el Worker de Matchmaking:")
    baseLogger.error(error)
    process.exit(1)
})

process.on("uncaughtException", (err) => {
    baseLogger.error("Excepción no capturada en el Worker de Matchmaking:")
    baseLogger.error(err)
    process.exit(1)
})

process.on("unhandledRejection", (err) => {
    baseLogger.error("Promesa rechazada sin manejar en el Worker de Matchmaking:")
    baseLogger.error(err)
    process.exit(1)
})