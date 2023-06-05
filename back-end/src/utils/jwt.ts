/* Este archivo contiene una función que genera un jwt para el usuario logueado */
import { usuarioDB } from "../interfaces/usuarioI";
import { sign } from "jsonwebtoken";

// Creamos una string que actuará como firma para el JWT
export const JWT_SIGN = "F^03Ci4RJycl";

export const generarJWT = ( usuario: usuarioDB ) => sign( usuario, JWT_SIGN, { expiresIn: '1h' } ); // Decimos que el jwt expirará en una hora
