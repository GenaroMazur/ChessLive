export default class AuthLoginDto {
    identity: string
    password: string

    constructor({ identity, password }: { identity: string; password: string }) {
        this.identity = identity
        this.password = password
    }
}
