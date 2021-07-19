import { Carrito, CarritoService } from './../services/carrito.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito-productos',
  templateUrl: './carrito-productos.component.html',
  styleUrls: ['./carrito-productos.component.css']
})
export class CarritoProductosComponent implements OnInit {

  productos: Carrito[] = [];

  constructor(private router:Router,private _carritoService:CarritoService) { }

  ngOnInit(): void {

    this._carritoService.getProductos()
    .subscribe(
      products => {
        this.productos = products;
        this._carritoService.update(this.productos);
      },
      error => {
        console.log(error);
      });

  }

  eliminarProducto(item:Carrito){

    if (item){


      this._carritoService.deleteProducto(item.id).subscribe(
        products => {
          this._carritoService.notifyDeleteSubcriptor(item.id);
          this.router.navigate(["/productos"]);
        },
        error => {
          console.log(error);
        });
    }

  }

}
