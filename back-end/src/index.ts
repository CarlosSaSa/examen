/* Punto de entrada para la aplicación */
import express, { Application, json, Request, Response } from "express";
import cors from "cors";
import UserRouter from "./routes/usuarioRouter";
import conexion from "./db/config";

// Creamos una aplicacion de express
const app: Application = express();

// Middlewares
app.use( json() );
app.use( cors() );

// Creamos las rutas
app.get('/', ( req: Request, res: Response ) => res.status(200).json({ estado: true, mensaje: "Servidor ok" }) );
app.use('/usuario', UserRouter );

// Creamos el servidor
conexion.connect().then(
    () => app.listen( 5000 , () => console.log("Servidor iniciado en el puerto 5000"))
).catch( (err: any) => {
    console.log('Ha ocurrido el siguiente error al conectarse a la BD: ', err );
} )
