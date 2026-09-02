import pino, { Logger as PinoLogger } from "pino"
import { container, injectable } from "tsyringe"

const LOG_LEVEL = process.env.LOG_LEVEL || "info"

const transport = pino.transport({
  targets: [
    {
      target: "pino-pretty",
      level: LOG_LEVEL,
      options: {
        colorize: true,
        translateTime: "SYS:standard", // [YYYY-MM-DD HH:mm:ss]
        messageFormat: "{msg}",
        errorLikeObjectKeys: ["err", "stack"],
        customPrettifiers: {},
      },
    },
  ],
})

export const baseLogger = pino(
  {
    level: LOG_LEVEL,
    serializers: {
      err: pino.stdSerializers.err,
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
)

export interface ILogger {
  info(msg: string, ...args: any[]): void
  error(msg: string, ...args: any[]): void
  warn(msg: string, ...args: any[]): void
  debug(msg: string, ...args: any[]): void
  child(name: string): ILogger
}

@injectable()
export class Logger implements ILogger {
  private logger: PinoLogger

  constructor() {
    this.logger = baseLogger
  }

  public info(msg: string, ...args: any[]): void {
    this.logger.info(msg, ...args)
  }

  public error(msg: string, ...args: any[]): void {
    this.logger.error(msg, ...args)
  }

  public warn(msg: string, ...args: any[]): void {
    this.logger.warn(msg, ...args)
  }

  public debug(msg: string, ...args: any[]): void {
    this.logger.debug(msg, ...args)
  }

  public child(name: string): ILogger {
    const childInstance = new Logger()
    childInstance.logger = this.logger.child({ name: `[${name.toUpperCase()}]` })
    return childInstance
  }
}

container.registerSingleton<ILogger>("Logger", Logger)

export const logger = container.resolve<ILogger>("Logger")


