import IRepository from "../../../../shared/interfaces/Repository.interface"
import User from "../entity/User"

export default interface UserRepository extends IRepository<User> {
    findByUsername(username: string): Promise<User | null>

    findByEmail(email: string): Promise<User | null>

    findByUsernameOrEmail(identity: string): Promise<User | null>
}
