import QueueElement from "../entity/QueueElement";

export default interface QueueService {
    /**
     * @returns queueId - member, format: <userId>:<timestamp>
     */
    setQueue(timeControl: string, elo: number, userId: string): Promise<string>

    delQueue(timeControl: string, member: string): void

    getBatchMembers(timeControl: string, batchSize: number): Promise<QueueElement[]>

    delTwoMembers(timeControl: string, member1: string, member2: string): Promise<boolean>

    getTimeControls(): Promise<string[]>
}