import UserException from "./User.exception"

/**
 * @swagger
 * components:
 *  responses:
 *      Unauthorized:
 *          description: (401) Excepción para cuando un usuario no está autorizado para acceder a un recurso
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UnauthorizedException'
 *  schemas:
 *      UnauthorizedException:
 *          description: (401) Excepción para cuando un usuario no está autorizado para acceder a un recurso
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  example: No autorizado para acceder a este recurso
 */
export default class UnauthorizedException extends UserException {
    constructor(message: string) {
        super(message || "No autorizado para acceder a este recurso")
        this.name = "UnauthorizedException"
        this.code = 401
        Object.setPrototypeOf(this, UnauthorizedException.prototype)
    }
}
