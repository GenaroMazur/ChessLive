export default interface IRepository<T> {
    save(domain: T): Promise<T>

    findById(id: string): Promise<T | null>

    delete(id: string | T): Promise<void>
}
