import { TokenUser } from './../services/token.service';
import { Component, OnInit } from '@angular/core';
import { Producto, ProductoService } from '../services/producto.service';
import { Router } from '@angular/router';
import { ControlauthService } from '../services/controlauth.service';
import { TokenService } from '../services/token.service';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})

export class ProductosComponent implements OnInit {

  productos:Producto[] = [];
  role:boolean =false;
  username: String = "";

  constructor(private _tokenService:TokenService,private _controlService:ControlauthService ,private _productoService:ProductoService,private router:Router) {

  }

  ngOnInit(): void {


    this.role = this._controlService.getRole();

    this._productoService.getProductos()
      .subscribe(
        products => {
          this.productos = products;
        },
        (responseError) => {
          alert(responseError.error.statusText);
        });
    this.username = this.getAuth().email;
  }

  getRole(){
    //return this.role;
    if (this.getAuth().role=="admin"){
      return true
    }
    return false;
  }

  getAuth():TokenUser{
    return this._tokenService.getToken();
  }

  verProducto( idx:any ){
    this.router.navigate( ['/producto',idx] );
  }

  crearProducto():void{
    this.router.navigate( ['/producto-create'] );
  }


}
