import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Ruta de login
  { path: 'dashboard', component: DashboardComponent, canActivate: [ AuthGuard ] }, // Ruta donde se mostraran los datos
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Ruta raiz que se va a redireccionar hacia la ruta de login
  { path: '**', redirectTo: 'login' } // Ruta 404 si cualquier path no coincide con la rutas anteriorere se hace el redirect hacia el login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
