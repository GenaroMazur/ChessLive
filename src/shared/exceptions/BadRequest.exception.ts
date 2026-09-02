import UserException from "./User.exception"

/**
 * @swagger
 * components:
 *  responses:
 *      BadRequest:
 *          description: (400) Excepción para cuando ocurre un error en la solicitud
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/BadRequestException'
 *  schemas:
 *      BadRequestException:
 *          description: (400) Excepción para cuando ocurre un error en la solicitud
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  example: Error en formulario
 */
export default class BadRequestException extends UserException {
    constructor(message: string, body?: object) {
        super(message || "Error en la solicitud", body)
        this.name = "BadRequestException"
        this.code = 400
        Object.setPrototypeOf(this, BadRequestException.prototype)
    }
}
