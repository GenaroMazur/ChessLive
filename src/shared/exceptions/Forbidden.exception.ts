import UserException from "./User.exception"

/**
 * @swagger
 * components:
 *  responses:
 *      Forbidden:
 *          description: (403) Excepción para cuando un usuario no tiene permisos para acceder a un recurso
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/ForbiddenException'
 *  schemas:
 *      ForbiddenException:
 *          type: object
 *          description: (403) Excepción para cuando un usuario no tiene permisos para acceder a un recurso
 *          properties:
 *              message:
 *                  type: string
 *                  example: No autorizado para realizare esta acción
 */
export default class ForbiddenException extends UserException {
    constructor(message?: string) {
        super(message || "No autorizado para realizare esta acción")
        this.name = "ForbiddenException"
        this.code = 403
        Object.setPrototypeOf(this, ForbiddenException.prototype)
    }
}
