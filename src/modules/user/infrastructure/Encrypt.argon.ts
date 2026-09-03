import { hash, verify, Options, argon2id } from "argon2"
import { logger } from "../../../shared/utils/logger"

import { injectable } from "tsyringe"
import EncryptService from "../domain/interfaces/Encrypt.service"

@injectable()
export default class EncryptArgon implements EncryptService {
    private readonly levels: Record<string, Options> = {
        low: {
            memoryCost: 2 ** 12, // 4MB
            timeCost: 2,
            parallelism: 1,
        },
        medium: {
            memoryCost: 2 ** 14, // 16MB
            timeCost: 3,
            parallelism: 1,
        },
        high: {
            memoryCost: 2 ** 16, // 64MB
            timeCost: 5,
            parallelism: 2,
        },
    }

    private getOptions(): Options {
        const level = process.env.PASSWORD_ENCRYPT_LEVEL || "medium"
        return this.levels[level] || this.levels.medium
    }

    private getTimeExecution() {
        const start = Date.now()
        return () => Date.now() - start
    }

    async encrypt(text: string): Promise<string> {
        const time = this.getTimeExecution()
        const hashed = await hash(text, { type: argon2id, ...this.getOptions() })
        const timeExecution = time()
        logger.debug(`Password encrypted in ${timeExecution}ms`)
        if (timeExecution > 200) {
            logger.warn(
                `Password encryption took ${timeExecution}ms, which is above the recommended threshold of 200ms`,
            )
        }
        return hashed
    }

    async compare(text: string, hashStr: string): Promise<boolean> {
        const time = this.getTimeExecution()
        const verified = await verify(hashStr, text)
        const timeExecution = time()
        logger.debug(`Password comparison took ${timeExecution}ms`)
        if (timeExecution > 200) {
            logger.warn(
                `Password comparison took ${timeExecution}ms, which is above the recommended threshold of 200ms`,
            )
        }
        return verified
    }
}
