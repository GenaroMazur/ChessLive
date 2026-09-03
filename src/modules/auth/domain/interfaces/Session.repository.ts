import IRepository from "../../../../shared/interfaces/Repository.interface"
import Session from "../entity/Session"

export default interface SessionRepository extends IRepository<Session> {
    revokeByFamily(family: string): Promise<void>

    findByRefreshToken(refreshToken: string): Promise<Session | null>

    saveAll(session: Session[]): Promise<void>
}
