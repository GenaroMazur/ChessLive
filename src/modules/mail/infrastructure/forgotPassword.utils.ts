export const htmlRecoveryPassword = (
    uniqueKey: string,
) => `<table style="width: 100%; max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0;">
    <tr style="background-color: #7B9FAD;">
        <td style="padding: 20px; text-align: center;">
            <h1 style="color: #fff;">Recuperar Contraseña</h1>
        </td>
    </tr>
    <tr>
        <td style="padding: 20px;">
            <p style="color: #555; font-size: 16px;">
                Hola,<br><br>
                Has solicitado recuperar tu contraseña para scope. Usa el siguiente código para restablecerla:
            </p>
            <div style="text-align: center; margin: 20px 0;">
                <span style="font-size: 24px; color: #007BFF; font-weight: bold;">${uniqueKey}</span>
            </div>
            <p style="color: #555; font-size: 16px;">
                Este código es válido por 5 minutos. Si no solicitaste este cambio, puedes ignorar este mensaje. 
            </p>
        </td>
    </tr>
    <tr style="background-color: #f8f8f8;">
        <td style="padding: 10px; text-align: center; color: #999;">
            <small>&copy; Todos los derechos reservados.</small>
        </td>
    </tr>
</table>`

export const htmlCreatePassword = (
    uniqueKey: string,
) => `<table style="width: 100%; max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0;">
    <tr style="background-color: #7B9FAD;">
        <td style="padding: 20px; text-align: center;">
            <h1 style="color: #fff;">Crear Contraseña</h1>
        </td>
    </tr>
    <tr>
        <td style="padding: 20px;">
            <p style="color: #555; font-size: 16px;">
                Has solicitado crear tu contraseña para ChessLive. Usa el siguiente código para crearla:
            </p>
            <div style="text-align: center; margin: 20px 0;">
                <span style="font-size: 24px; color: #007BFF; font-weight: bold;">${uniqueKey}</span>
            </div>
            <p style="color: #555; font-size: 16px;">
                Este código es válido por 5 minutos. Si no solicitaste este cambio, puedes ignorar este mensaje. 
            </p>
        </td>
    </tr>
    <tr style="background-color: #f8f8f8;">
        <td style="padding: 10px; text-align: center; color: #999;">
            <small>&copy; Todos los derechos reservados.</small>
        </td>
    </tr>
</table>`

const FRONTEND_URL = process.env.FRONTEND_URL

export const htmlWelcomeMessage =
    () => `<table style="width: 100%; max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0;">
    <tr style="background-color: #7B9FAD;">
        <td style="padding: 20px; text-align: center;">
            <h1 style="color: #fff;">¡Bienvenido a ChessLive!</h1>
        </td>
    </tr>
    <tr>
        <td style="padding: 20px;">
            <p style="color: #555; font-size: 16px;">
                Hola,<br><br>
                Te damos la bienvenida al sistema de ChessLive. Para comenzar a utilizar tu cuenta, es necesario que establezcas tu contraseña.
            </p>
            <p style="color: #555; font-size: 16px;">
                Por favor, dirígete al portal y utiliza la opción de <strong>"Recuperar Contraseña"</strong> para configurar tus credenciales de acceso por primera vez.
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${FRONTEND_URL}" style="background-color: #007BFF; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ir al Portal</a>
            </div>
        </td>
    </tr>
    <tr style="background-color: #f8f8f8;">
        <td style="padding: 10px; text-align: center; color: #999;">
            <small>&copy; Todos los derechos reservados.</small>
        </td>
    </tr>
</table>`
