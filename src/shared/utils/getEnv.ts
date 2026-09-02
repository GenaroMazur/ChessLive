export default function GetEnv<T extends boolean>(
    env: string,
    throwError: T,
): T extends true ? string : string | undefined {
    if (throwError && !process.env[env])
        throw new Error(`Environment variable ${env} is not defined`)

    return process.env[env] as string
}
