import { CorsOptions } from "cors"

export const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
    : []

export const getCorsOptions = (): CorsOptions => {
    const isDevelopment = process.env.NODE_ENV === "development"

    return {
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true)
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true)
            }

            if (isDevelopment && /^http:\/\/localhost(:\d+)?$/.test(origin)) {
                return callback(null, true)
            }

            return callback(null, false)
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        optionsSuccessStatus: 200,
    }
}
