export default interface RepositoryInterface<T> {
    save(entity: T): Promise<T>

    findById(id: string, tenantId?: string): Promise<T | null>

    delete(id: string | T, tenantId?: string): Promise<void>
}
