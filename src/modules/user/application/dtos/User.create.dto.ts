export default class UserCreateDto {
    username: string
    firstName: string
    lastName: string
    email: string
    password: string

    constructor({ username, firstName, lastName, email, password }: UserCreateDto) {
        this.username = username
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.password = password
    }
}
