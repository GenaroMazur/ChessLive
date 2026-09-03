export default class QueueElement {
    readonly elo: number
    readonly userId: string
    readonly timestamp: number
    readonly member: string
    processed: boolean

    constructor(elo: number, userId: string, timestamp: number, member: string) {
        this.elo = elo
        this.userId = userId
        this.timestamp = timestamp
        this.member = member
        this.processed = false
    }

    calculateEloWindow(): number {
        const secondsWaiting = (new Date().getTime() - this.timestamp) / 1000
        const growthRate = 15
        const baseWindow = 10
        const maxWindow = 300

        return Math.min(baseWindow + growthRate * Math.log(1 + secondsWaiting), maxWindow)
    }
}