import SystemException from "./System.exception"

/**
 * @swagger
 * components:
 *  schemas:
 *      UserException:
 *          type: object
 *          description: Excepción para cuando ocurre un error en el usuario
 *          properties:
 *              message:
 *                  type: string
 *                  example: Error de usuario
 */
export default class UserException extends SystemException {
    code?: number
    constructor(message: string, body?: object) {
        super(message, body)
        this.name = "UserException"
    }
}
