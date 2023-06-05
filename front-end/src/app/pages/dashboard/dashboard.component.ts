import { Component, OnInit } from '@angular/core';
import { Productos } from 'src/app/interfaces/productosI';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // Para guardar los productos
  productos: Productos[] = [];
  // Para editar los datos del producto
  datosProducto!: FormGroup;
  // Para el item selecionado
  productoSeleccionado: Productos | null = null;
  // Para guardar el historial de cambios
  productosHistoricos: Productos[] = [];
  productoOrigina: Productos[] = []; // para almacenar el producto orginal

  productoHistoricoSeleccionado = { value: -1, tipo: "" };

  constructor( private usuarioService: UsuarioService, private fb: FormBuilder  ){}

  ngOnInit() {
    this.obtenerProductos(); // Llamamos a la API
    this.initForm(); // Inicializamos el formulario

  }

  // Para llamar a la api
  async obtenerProductos() {
    try {
      this.productos = await this.usuarioService.obtenerProductos();
      // console.log('Array de productos: ', this.productos );
    } catch (error) {
      console.log('Ha ocurrido el error: ', error );
    }
  }

  // Para inicializar el formulario
  initForm() {
    this.datosProducto = this.fb.group({
      title: ['', Validators.required ],
      description: ['', Validators.required ],
      price: ['', Validators.required] ,
      brand : ['', Validators.required],
      category : ['', Validators.required]
    })
  }

  // Para editar el item
  editarItem( item: Productos ) {
    console.log('Item a editar', item );
    // Asignamos los valores al item seleccionado
    this.productoSeleccionado = item; // guardamos el producto seleccionado en memoria
    const { title, description, price, brand, category } = item;
    // Lo actualizamos en el form
    this.datosProducto.setValue({ title, description, price, brand, category });
    // Obtenemos la referencia del modal
    const modal = document.querySelector("#modalFormData") as HTMLElement;
    // lo abrimos con click
    modal.click();


  }

  // Para eliminar el item
  eliminarItem( item: Productos ) {
    // Extraemos el id del item
    const { id } = item;
    // Hacemos la petición hacia el server
    this.usuarioService.eliminarProducto( id )
    .subscribe({
      next: ( data: any ) => {
        // Como sabemos que se ha eliminado el registro tanto en BD ( con sus historicos entonces tenemos que eliminar de la lista de productos el elemento con ese id )
        this.productos = this.productos.filter( (producto: Productos) => producto.id !== id );
      },
      error: ( err: HttpErrorResponse ) => {
        console.log('Error: ', err );
      }
    })
  }

  // Para mostrar el historial de cambios
  mostrarHistorial( item: Productos ) {
    console.log('Item: ', item);
    // Extramos el id
    const { id } = item;
    const modalCambios = document.querySelector("#modalCambiosData") as HTMLElement;
    modalCambios.click();
    // Hacemos la petición hacia el server
    this.usuarioService.obtenerHistoricos( id ).subscribe({
      next: ( data: any ) => {
       this.productoOrigina = data.productos || [];
       this.productosHistoricos = data.productos_historicos || [];

      },
      error: ( err: HttpErrorResponse ) => {
        console.log('Ha ocurrido un error la obtener los datos historicos', err );
      }
    })

  }


  // Para el submit
  onSubmit() {
    // Si el formulario es invalido entonces no hacemos nada
    if ( this.datosProducto.invalid )
      return;

    // Hacemos la petición a la API
    const id = this.productoSeleccionado?.id;
    this.usuarioService.ingresarProduto( {...this.datosProducto.value, id } )
    .subscribe({
      next: ( data: any ) => {
       const productoActualizado: Productos = data.producto[0];
       // actualizamos los datos para ingresar el nuevo registro actualizado
       const index = this.productos.findIndex( (producto: Productos) => producto.id == productoActualizado.producto_id );
       productoActualizado["id"] = productoActualizado["producto_id"] as any; // seteamos el nombre del id
       this.productos[index] = productoActualizado;
       // Tenemos que cerrar el modal
        const modalIngreso = document.querySelector("#modalIngreso") as HTMLElement;
        modalIngreso.click();

      },
      error: ( err: HttpErrorResponse ) => {
        console.log('Error: ', err );
      }
    })
  }

  // Para observar los cambios
  changeHistorico( e: Event ) {
    const tipoProducto = (e.target as HTMLInputElement).getAttribute("data-catalogo") || '';
    this.productoHistoricoSeleccionado = { ...this.productoHistoricoSeleccionado, tipo: tipoProducto }
  }

 // Setear el elemento historico
 cambiarHistorico() {
  // Obtenemos el value y el tipo para saber en donde buscar
  const { value, tipo } = this.productoHistoricoSeleccionado;
  // Si el tipo es producto entonces buscamos en el array de productos
  if ( tipo == "productos" ){
    const index = this.productos.findIndex( (producto: Productos) => producto.id == value );
    const productoHistorico = this.productoOrigina.find( (producto: Productos) => producto.producto_id == value );
    if( productoHistorico ) { // Si existe el producto historico tenemos que setear el id al valor del producto_od
      productoHistorico["id"] = productoHistorico["producto_id"] as any;
    }
    this.productos[index] =  productoHistorico as any;

  } else { // es de historicos
    // Recuperamos aquel producto que es igual al value que reescribimos 
    const productoHistorico = this.productosHistoricos.find( (producto: Productos) => producto.producto_historico_id == value );
    const index = this.productos.findIndex( (producto: Productos ) => producto.id == productoHistorico?.producto_id ); // Encontramos el indice donde el id es igual al producto_id
    if( productoHistorico ) { // Si existe el producto historico tenemos que setear el id al valor del producto_od
      productoHistorico["id"] = productoHistorico["producto_id"] as any;
    }
    // Este producto lo tenemos que setear en el indice del array de productos
    this.productos[index] = productoHistorico  as any;
  }

  // Cerramos el modal
  const modalHistorico = document.querySelector("#cerrarModalHistorico") as HTMLElement;
  modalHistorico.click();
 }


}
