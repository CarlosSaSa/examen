export interface Productos {
    id: number, // para el producto_id de la api
    title: string,
    description: string,
    price : number,
    brand : string,
    category : string,
    discountPercentage?: number,
    rating? : number,
    stock?: number,
    thumbnail?: string,
    images?: string[],
    producto_historico_id?: number // para el producto_id de la BD
    producto_id?: number // para el producto_id de la BD
}