import pinoHttp from "pino-http"
import {baseLogger} from "../../../shared/utils/logger";


const isDev = process.env.NODE_ENV !== "production"

export const httpLogger = pinoHttp({
    logger:baseLogger.child({ name: `[HTTP]` }),
    customLogLevel: (_req, res) => {
        if (res.statusCode >= 500) return "error"
        if (res.statusCode >= 400) return "warn"
        return "info"
    },
    customSuccessMessage: (req, res) => {
        return `${req.method} ${req.url} ${res.statusCode}`
    },
    serializers: isDev
        ? {
              req: (req) => ({ method: req.method, url: req.url }),
              res: (res) => ({ statusCode: res.statusCode }),
          }
        : undefined,
})
