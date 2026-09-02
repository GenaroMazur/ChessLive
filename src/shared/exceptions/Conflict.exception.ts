import UserException from "./User.exception"

/**
 * @swagger
 * components:
 *  responses:
 *      Conflict:
 *          description: (409) Excepción para cuando ocurre un conflicto en los datos
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/ConflictException'
 *  schemas:
 *      ConflictException:
 *          description: (409) Excepción para cuando ocurre un conflicto en los datos
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  example: No se pueden guardar los datos debido a conflictos
 */
export default class ConflictException extends UserException {
    constructor(message?: string) {
        super(message || "Existen conflictos en los datos")
        this.name = "ConflictException"
        this.code = 409
        Object.setPrototypeOf(this, ConflictException.prototype)
    }
}
