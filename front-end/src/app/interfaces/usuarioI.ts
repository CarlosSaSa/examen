/* Interfaces para la aplicación */
export interface response {
    estado: boolean,
    mensaje: string
}

export interface usuarioLogin extends response {
    jwt: string
}