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
      },
      error => {
        console.log(error);
      });

  }

  eliminarProducto(index:number){

    if (index>=0){

      const carrito:any = this.productos[index];

      const idx = carrito.producto.id;

      this._carritoService.deleteProducto(Number(idx)).subscribe(
        products => {
          this._carritoService.notifyDeleteSubcriptor(Number(idx));
          this.router.navigate(["/productos"]);
        },
        error => {
          console.log(error);
        });
    }

  }

}
