import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { CarritoProductosComponent } from './carrito-productos/carrito-productos.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductosComponent } from './productos/productos.component';
import { ProductoComponent } from './producto/producto.component';
import { ProductoCreateComponent } from './producto-create/producto-create.component';
import { ProductoEditComponent } from './producto-edit/producto-edit.component';
import {ControlRoutesGuard} from './control-routes.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'productos', component: ProductosComponent,canActivate:[ControlRoutesGuard] },
  { path: 'producto/:id', component: ProductoComponent,canActivate:[ControlRoutesGuard] },
  { path: 'producto-create', component: ProductoCreateComponent,canActivate:[ControlRoutesGuard] },
  { path: 'producto-edit/:id', component: ProductoEditComponent,canActivate:[ControlRoutesGuard] },
  { path: 'carrito', component: CarritoProductosComponent,canActivate:[ControlRoutesGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})


export class AppRoutingModule { }
