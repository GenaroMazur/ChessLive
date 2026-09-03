export default interface EncryptService {
    encrypt(text: string): Promise<string>

    /**
     * Compare text with hash
     * @param text text to compare
     * @param hash hash to compare with text
     */
    compare(text: string, hash: string): Promise<boolean>
}
