export default interface PasswordEncoder {
    encode(password: string): Promise<string>

    compare(password: string, hash: string): Promise<boolean>
}
