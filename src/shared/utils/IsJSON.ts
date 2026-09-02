export default function IsJSON(str: string): boolean {
    try {
        JSON.parse(str)
    } catch {
        return false
    }
    return true
}
