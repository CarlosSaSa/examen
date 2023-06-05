import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { JWT_SIGN } from "../utils/jwt";

/* Este archivo contiene lo necesario para el middleware */
export const AuthJWT = (req: Request, res: Response, next: NextFunction ) => {
    // Obtenemos el token desde el header
    const token = req.headers.authorization;

    // Si no se encuentra entonces no es válido y no lo dejamos avanzar
    if (!token) {
        return res.status(401).json({estado: false, mensaje: 'Sus credenciales no han sido encontradas'});
    }

    // Intentamos obtener el token valido
    try {
        const decodedToken = verify(token, JWT_SIGN ); 
        if ( decodedToken )
            return next();
        return  res.status(401).json({ estado: false, mensaje: 'Sesión inválida' })
       
    } catch (error: any) {
        if ( error.expiredAt ) {
            return res.status(401).json({ estado: false, mensaje: 'Su sesíon ha caducado, debe de volver a iniciar sesión' })
        } 
        return res.status(401).json({ estado: false, mensaje: 'Se ha detectado que su sesión es inválida' });
    }
}