import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URI_DEMO, URI_SERVER } from '../config/config';
import { usuarioLogin } from '../interfaces/usuarioI';
import { Productos } from '../interfaces/productosI';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( private http: HttpClient ) { }

  // Petición para traer datos del usuario
  login( username: string, password: string  ) {
    return this.http.post<usuarioLogin>( `${ URI_SERVER }/usuario/login`, { username, password } );
  }

  // Petición para obtener los productos del fake api, esto por medio de fectch
  async obtenerProductos(): Promise<Productos[]> {
    // Obtenemos el token de sessionStorage
    const token = sessionStorage.getItem('token') || ''; 

    try {
      const resp = await fetch(`${ URI_DEMO }`, { method: 'GET', headers: { Authorization: token } });
      const data = await resp.json();
      return data.products;
    } catch (error) {
      // console.log('Ha ocurrido un error al obtener los productos');
      throw new Error("Ha ocurrido el siguiente error: " + error );
    }
  }

  // Petición para hacer la actualización o el ingreso dl producto
  ingresarProduto( producto: Productos ) {
    // Obtenemos el token de sessionStorage
    const token = sessionStorage.getItem('token') || ''; 
    return this.http.post(`${URI_SERVER}/usuario/ingresarProducto`, producto, { headers: { Authorization: token } } );
  }

  // Petición para eliminar el producto
  eliminarProducto( producto_id: number ) {
    // Obtenemos el token de sessionStorage
    const token = sessionStorage.getItem('token') || ''; 
    return this.http.delete(`${URI_SERVER}/usuario/eliminarPrdocuto/${producto_id}`, { headers: { Authorization: token } } );
  }

  // Petición para obtener los productos historicos
  obtenerHistoricos( producto_id: number ) {
    // Obtenemos el token de sessionStorage
    const token = sessionStorage.getItem('token') || ''; 
    return this.http.get(`${ URI_SERVER }/usuario/obtenerHistorico/${producto_id}`, { headers: { Authorization: token } });
  }


} 
