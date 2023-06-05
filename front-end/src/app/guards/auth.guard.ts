import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor( private router: Router ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   
      // Extraemos el jwt de sessionStorage
      try {
        // Obtenemos el token de localstorage
        const token = sessionStorage.getItem('token') || '';
        // Si no existe un token redireccionamos hacia el inicio de sesion
        if ( !token ) {
          this.router.navigate(['login']);
          return false;
        }

        return true;
  
  
      } catch (error) {
        console.log('Error en el guarda de autenticacion: ', error);
        this.router.navigate(['login']);
        return false;
      }  

  }
  
}
