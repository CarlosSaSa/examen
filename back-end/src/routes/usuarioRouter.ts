/* Definimos las rutas que podrá usar el usaurio */
import { Router } from "express";
import { eliminarProducto, ingresarProducto, loginController, obtenerHistoricos } from "../controllers/usuarioController";
import { AuthJWT } from "../middlewares/authMiddleware";

// Creamos un router
const app: Router = Router();

// Usamos el middleware para proteger a la ruta
// Creamos una rutas
app.post('/login', loginController ); // para iniciar sesión 
app.post('/ingresarProducto', [ AuthJWT ] ,ingresarProducto ); // para ingresar un producto a la tabla de historico
app.delete('/eliminarPrdocuto/:id', [AuthJWT] ,eliminarProducto); // Para eliminar un producto de acuerdo al producto id
app.get('/obtenerHistorico/:id', [AuthJWT] ,obtenerHistoricos );
// Hacemos la exportación por defecto
export default app;

