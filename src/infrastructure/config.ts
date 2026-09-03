import { container } from "tsyringe"
import UserPostgresRepository from "../modules/user/infrastructure/repository/User.postgres.repository"
import PostgresConnection from "./PostgresConnection"
import GetEnv from "../shared/utils/getEnv"
import EncryptArgon from "../modules/user/infrastructure/Encrypt.argon"
import SessionPostgresRepository from "../modules/auth/infrastructure/repository/Session.postgres.repository"
import FakeMailService from "../modules/mail/infrastructure/services/FakeMail.service"
import LockRedisService from "../modules/auth/infrastructure/Lock.redis.service"
import RedisConnection from "./cache/RedisConnection"

container.registerInstance("REDIS_URL", GetEnv("REDIS_URL", true))
container.registerInstance("PORT", GetEnv("TCP_PORT", true))
container.registerInstance("DATABASE_URL", GetEnv("DATABASE_URL", true))

container.registerSingleton(RedisConnection)
container.registerSingleton("DataSource", PostgresConnection)

container.registerSingleton("EncryptService", EncryptArgon)
container.registerSingleton("MailService", FakeMailService)
container.registerSingleton("LockService", LockRedisService)

container.registerSingleton("UserRepository", UserPostgresRepository)
container.registerSingleton("SessionRepository", SessionPostgresRepository)
