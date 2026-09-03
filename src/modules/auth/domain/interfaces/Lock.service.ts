export default interface LockService {
    lock(refreshToken: string): Promise<string>

    unlock(refreshToken: string, uniqueKey: string): Promise<void>
}
