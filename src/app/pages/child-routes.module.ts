import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesViewComponent } from './conf/roles/roles-view/roles-view.component';

//pages
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UsersComponent } from './users/users.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AuthGuard } from '../guards/auth.guard';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { RetadorComponent } from './gamificacion/retador/retador.component';




const childRoutes: Routes = [

  // 1. Redirección inicial: Si entran a '', los manda a /dashboard
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // 2. Ruta real: Aquí es donde verdaderamente se protege y se carga el componente
  { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },

  // 3. Comodín: Cualquier ruta inválida también va al Dashboard (debe ir al final)
  { path: '**', redirectTo: 'dashboard' },
  //auth

  //configuraciones,
  { path: 'roles', component: RolesViewComponent, data: { tituloPage: 'Roles' } },

  { path: 'notificaciones', component: NotificacionesComponent, data: { tituloPage: 'Notificaciones' } },

  { path: 'buscar', component: BusquedaComponent, data: { tituloPage: 'Busquedas' } },
  { path: 'buscar/:termino', component: BusquedaComponent, data: { tituloPage: 'Busquedas' } },
  { path: 'rolesconf', component: RolesViewComponent, data: { title: 'Planes' } },

  { path: 'retadores', component: RetadorComponent, data: { title: 'Retador' } },

  //user
  { path: 'users', component: UsersComponent, data: { title: 'Usuarios' } },
  { path: 'user/:id', component: UserProfileComponent, data: { title: 'Detalle Usuario' } },
  { path: 'user/edit/:id', component: UserProfileComponent, data: { title: 'Editar Usuario' } },


  { path: 'search/:searchItem', component: UsersComponent, data: { title: 'Buscar' } },









]

@NgModule({
  imports: [
    // RouterModule.forRoot(appRoute),
    RouterModule.forChild(childRoutes),
  ],
  exports: [RouterModule]
})
export class ChildRoutesModule { }
