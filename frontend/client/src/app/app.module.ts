import { TokenService } from './services/token.service';
import { configSocket } from './../environments/environment';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductosComponent } from './productos/productos.component';
import { ProductoTarjetaComponent } from './producto-tarjeta/producto-tarjeta.component';
import { ProductoService } from './services/producto.service';
import {ControlauthService} from './services/controlauth.service';
import { ProductoComponent } from './producto/producto.component';
import { ProductoCreateComponent } from './producto-create/producto-create.component';
import { ProductoEditComponent } from './producto-edit/producto-edit.component';
import { CarritoService} from './services/carrito.service';
import { HttpClientModule } from '@angular/common/http';
import { CarritoProductosComponent } from './carrito-productos/carrito-productos.component';
import { MensajesUsuariosComponent } from './mensajes-usuarios/mensajes-usuarios.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { OrdenesComponent } from './ordenes/ordenes.component';
import { OrdenService } from './services/orden.service';
import { OrdenComponent } from './orden/orden.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    NavbarComponent,
    ProductosComponent,
    ProductoTarjetaComponent,
    ProductoComponent,
    ProductoCreateComponent,
    ProductoEditComponent,
    CarritoProductosComponent,
    MensajesUsuariosComponent,
    LoginComponent,
    SignupComponent,
    OrdenesComponent,
    OrdenComponent  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(configSocket)
  ],
  providers: [ProductoService,ControlauthService,CarritoService,TokenService,OrdenService],
  bootstrap: [AppComponent]
})
export class AppModule { }
