// Creamos la configuración para conectarse a la BD
import {  Client } from "pg";

const conexion = new Client({
    host: "localhost",
    port: 5432,
    database: "examen",
    user: "postgres",
    password: "************"
});

export default conexion;
