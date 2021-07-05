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
    MensajesUsuariosComponent  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(configSocket)
  ],
  providers: [ProductoService,ControlauthService,CarritoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
