/* Archivo que va a contener los controladores para el router de usuario */

import { Response, Request } from "express";
import conexion from '../db/config';
import { usuarioDB } from "../interfaces/usuarioI";
import { createHash } from "crypto";
import { generarJWT } from "../utils/jwt";

export const loginController = async ( req: Request, res: Response ) => {
    // Del body recuperamos el username y la contraseña
    try {
        const { username, password } = req.body;
        // Verificamos que exista el username y el password
        if ( !username || !password )
            return res.status(400).json({ estado: false, mensaje: "Debe de proporcionar las credenciales " });

        // Si si existen entonces hacemos una consulta a la bd para buscar el usuario por el username 
        const usuario_sql = 'SELECT usuario_id, username, password FROM usuarios WHERE username = $1';
        const { rows: usuarios } = await conexion.query<usuarioDB>( usuario_sql, [ username ] );

        console.log('Usuarios: ', usuarios );

        // Si no existe el usuario entonces mandamos un error de no encontrado
        if ( usuarios.length <= 0 )
            return res.status(404).json({ estado: false, mensaje: "Usuario y/o contraseña incorrecta" });
        
        // Obtenemos el usuario
        const [ usuario ] = usuarios;
        const passwordDB = usuario.password;
        console.log( createHash("md5").update( password ).digest("hex") )
        // Ahora verificamos que el password coincida 
        if ( !( createHash("md5").update( password ).digest("hex") == passwordDB)  )
            return res.status(400).json({ estado: false, mensaje: "Usuario y/o contraseña no encontrado" });

        // Si si ha pasado con exito entonces ahora generamos el jwt pero borrando el password del objeto usuario
        delete usuario.password;
        const jwt = generarJWT( usuario );
        return res.status(200).json({ estado: true, mensaje: "Inicio de sesión correcto", jwt });

    } catch (error) {
        return res.status(500).json({ estado: false, mensaje: "Ha ocurrido un error en el servidor favor de intentar mas tarde" });
    }


}

// Controlador para actualizar o ingresar el producto
export const ingresarProducto = async( req: Request, res: Response ) => {

    try {
        // Obtenemos del body el producto
        const { id, title, description, price, brand, category } = req.body;
        // console.log("Body:", req.body );
        // Hacemos algunas validaciones
        if ( !title || !description || !price || !brand || !category || !id ) 
            return res.status(400).json({ estado: false, mensaje: "Debe de proporcionar todos los valores" });

        // Revisamos el tamaño de algunas cadenas por el tamaño de base de datos
        if ( title.length > 100 || brand.length > 50 || category.length > 100  )
            return res.status(400).json({ estado: false, mensaje: "Revise el tamaño de las cadenas" });
        
        // Revisamos el precio que sea un numero 
        if ( isNaN( Number( price )) || !/^\d+$/.test( price ) )
            return res.status(400).json({ estado: false, mensaje: "Revise que el precio sea un número" });
        
        // Hasta aqui todas las validaciones han pasado entonces hacemos una consulta  a la BD
        const producto_sql = "SELECT 1 FROM productos WHERE producto_id = $1;";
        const {rows :productos} = await conexion.query( producto_sql, [ id ] );

        if ( productos.length <= 0 ){
            // Si no existe entonces hay que agregarlo en la BD en la tabla de producto
            const sql_insert = "INSERT INTO productos( producto_id, title, description, price, brand, category, isactive ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;"
            const {rows: producto  } = await conexion.query(sql_insert, [ id, title, description, price, brand, category, true ]);
            return res.status(200).json({ estado: true, mensaje: "Producto actualizado correctamente", producto });

        } else {
            // Si ya existe entonces vamos a agregar el registro al historico
            const sql_insert = "INSERT INTO producto_historico( title, description, price, brand, category, fecha_ingreso, producto_id ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP ,$6 ) RETURNING *";
            const { rows: producto } = await conexion.query( sql_insert, [  title, description, price, brand, category, id  ] );
            return res.status(200).json({ estado: true, mensaje: "Cambio agregado correctamente", producto });
        }

    } catch (error) {
        console.log('Error: ', error );
        return res.status(500).json({ estado: false, mensaje: "Ha ocurrido un error en el servidor favor de intentar mas tarde" });
    }

}

// Controlador para eliminar un producto
export const eliminarProducto = async ( req: Request, res: Response ) => {
    // Extraemos el producto_id
    const { id } = req.params;

    // tiene que ser un id válido
    if ( !id || isNaN( Number(id) ) )
        return res.status(400).json({ estado: false, mensaje: "Debe de proporcionar un id valido" });

    try {
        // Buscamos el registro
        const sql_producto = "SELECT 1 FROM productos WHERE producto_id = $1";
        const { rows: productos } = await conexion.query( sql_producto, [ id ] );

        // Si no existe entonces mandamos una bandera diciendo que se debe de eliminar el dato en memoria
        if  ( productos.length <= 0 ) {
            return res.status(200).json({ estado: true, mensaje: "El registro no existe en BD", existeBD: false });
        } else {
            // Tambien borramos los registros de la tabla de historicos ( normalmente se tiene que hacer uso de transacciones para garantizar el eliminado en ambas tablas )
            await conexion.query("DELETE FROM producto_historico WHERE producto_id = $1", [ id ]);
           
            // Eliminamos los registros asociados
            const sql_delete_producto = "DELETE FROM productos WHERE producto_id = $1;"
            await conexion.query( sql_delete_producto, [ id ] );

            return res.status(200).json({ estado: true, mensaje: "Registro eliminado correctamente", existeDB: true });
        }
    } catch (error) {
        console.log("Ha ocurrido un error: ", error );
        return res.status(500).json({ estado: false, mensaje: "Ha ocurrido un error en el servidor favor de intentar mas tarde" });
    }


}

// Controlador para obtener todos los cambios historicos del prodcuto
export const obtenerHistoricos = async ( req: Request, res: Response ) => {
    // Obtenemos el id del producto
    const { id } = req.params;

    // Si no existe o es invalido
    if ( !id || isNaN( Number( id ) ) )
        return res.status(400).json({ estado: false, mensaje: "Debe de proprocionar un id válido" });

    try {
        // Obtenemos todos los historicos del producto
        const sql_productos = "SELECT producto_historico_id, title, description, price, brand, category, fecha_ingreso, producto_id FROM producto_historico WHERE producto_id = $1;";
        const { rows: productos_historicos } = await conexion.query( sql_productos, [ id ] );

        // Para obtener el primer dato del producto
        const sql_producto_original = "SELECT producto_id, title, description, price, brand, category FROM productos WHERE producto_id = $1;";
        const { rows: productos } = await conexion.query( sql_producto_original, [ id ] );

        return res.status(200).json({ estado: true, mensaje: "Datos historicos obtenidos correctamente", productos_historicos, productos });

    } catch (error) {
        console.log("Error: ", error );
        return res.status(500).json({ estado: false, mensaje: "Ha ocurrido un error en el servidor favor de intentar mas tarde" });
    }



}