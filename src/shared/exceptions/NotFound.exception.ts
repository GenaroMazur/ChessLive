import UserException from "./User.exception"

/**
 * @swagger
 * components:
 *  responses:
 *      NotFound:
 *          description: (404) Excepción para cuando un recurso no existe
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/NotFoundException'
 *  schemas:
 *      NotFoundException:
 *          description: (404) Excepción para cuando un recurso no existe
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  example: Recurso no encontrado
 */
export default class NotFoundException extends UserException {
    constructor(message: string) {
        super(message || "Recurso no encontrado")
        this.name = "NotFoundException"
        this.code = 404
        Object.setPrototypeOf(this, NotFoundException.prototype)
    }
}
