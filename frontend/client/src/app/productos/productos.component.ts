import { Component, OnInit } from '@angular/core';
import { Producto, ProductoService } from '../services/producto.service';
import { Router } from '@angular/router';
import { ControlauthService } from '../services/controlauth.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})

export class ProductosComponent implements OnInit {

  productos:Producto[] = [];
  role:boolean =false;

  constructor(private _controlService:ControlauthService ,private _productoService:ProductoService,private router:Router) {

  }

  ngOnInit(): void {


    this.role = this._controlService.getRole();

    this._productoService.getProductos()
      .subscribe(
        products => {
          this.productos = products;
        },
        error => {
          console.log(error);
        });
  }

  getRole(){
    return this.role;
  }

  verProducto( idx:number ){
    this.router.navigate( ['/producto',idx] );
  }

  crearProducto():void{
    this.router.navigate( ['/producto-create'] );
  }


}
