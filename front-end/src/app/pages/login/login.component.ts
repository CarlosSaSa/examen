import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { usuarioLogin } from 'src/app/interfaces/usuarioI';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // Creamos un formuario para almacenar los datos del login
  usuarioForm!: FormGroup;

  constructor( private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router  ) {}
  
  ngOnInit(): void {
    // Inicializamos el formulario
    this.initForm();
  }

  // Método para inicializar el formulario
  initForm() {
    this.usuarioForm = this.fb.group({
      username: ['',  Validators.required ],
      password: ['', Validators.required]
    });
  }

  // Metodo para hacer submit al formulario
  onSubmit() {
    // Si el formulario no es valido no hacemos nada
    if ( this.usuarioForm.invalid )
      return;
    // Extramos los datos del formulario
    const { username, password } = this.usuarioForm.value;
    // Hacemos la petición hacia el usuario
    this.usuarioService.login( username, password ).subscribe({
      next: ( data: usuarioLogin ) => {
        // Extramos el jwt  y lo guardamos en sessionStorage
        sessionStorage.setItem("token", data.jwt );
        // Navegamos hacia la ruta dashboorad
        this.router.navigate(['dashboard']);

      },
      error: ( err: HttpErrorResponse ) => {
        console.log('Ha ocurrido un error mientras se hacia la petición: ', err );
      }
    })



  }

}
