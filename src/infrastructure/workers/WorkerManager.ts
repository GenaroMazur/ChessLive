import {Worker} from "node:worker_threads";
import path from "node:path";
import {EventEmitter} from "node:events";
import {inject, injectable} from "tsyringe";
import {baseLogger, ILogger} from "../../shared/utils/logger";

@injectable()
export default class WorkerManager extends EventEmitter{
    private worker: Worker | null = null;
    private readonly logger: ILogger;

    constructor(@inject("Logger") logger: ILogger) {
        super();
        this.logger = logger.child("Worker_Manager");
    }

    start() {
        if (this.worker) return;

        const isTs = __filename.endsWith(".ts");
        const workerPath = path.resolve(__dirname, "./matchMaking/Worker.bootstrap" + (isTs ? ".ts" : ".js"));

        this.worker = new Worker(workerPath, isTs ? {
            execArgv: ["--import", "tsx"]
        } : undefined);

        this.worker.on("error", (err) => {
            this.logger.error("Error no capturado en Worker Thread:");
            baseLogger.error(err);
        });

        this.worker.on("exit", (code) => {
            this.logger.warn(`Worker Thread finalizó con código de salida: ${code}`);
            this.worker = null;
        });
    }

    async stop(): Promise<void> {
        if (!this.worker) return;

        return new Promise((resolve) => {
            this.worker?.on("exit", () => resolve());
            // Enviar orden de apagado limpio al hilo
            this.worker?.postMessage({type: "STOP"});
        });
    }
}