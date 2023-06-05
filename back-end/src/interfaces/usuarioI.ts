/* En este archivo se declaran interfaces para los distintos proyectos */
export interface usuarioDB {
    usuario_id: number,
    username: string,
    password?: string // Hacemps la propiedad como opcional
}