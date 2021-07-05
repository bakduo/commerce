import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from '../services/carrito.service';
import { ControlauthService } from '../services/controlauth.service';
import { ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-producto-tarjeta',
  templateUrl: './producto-tarjeta.component.html',
  styleUrls: ['./producto-tarjeta.component.css']
})
export class ProductoTarjetaComponent implements OnInit {

  @Input() producto: any = {};
  @Input() index: number | undefined;

  @Output() productoSeleccionado: EventEmitter<number>;

  role:boolean = false;

  constructor(private _carritoService:CarritoService, private _controlService:ControlauthService ,private router:Router,private _productoService:ProductoService) {
    this.productoSeleccionado = new EventEmitter();
    this.index = -1;
    this.role = _controlService.getRole();
  }

  ngOnInit(): void {
  }

  getRole(){
    return this.role;
  }

  verProducto(){
    this.router.navigate(["/producto",this.index]);
  }

  eliminarProducto(){
      this._productoService.deleteProducto(Number(this.index)).subscribe(
        response => {
          this.router.navigate(["/"]);
        },
        error => {
          console.log(error);
        });
  }

  editarProducto(){
    this.router.navigate(["/producto-edit",this.index]);
  }

  agregarCarrito(){

    this._carritoService.addProducto(Number(this.index)).subscribe(
      response => {
        this._carritoService.notifySubcriptor(Number(this.index));
      },
      error => {
        console.log(error);
      });
  }

}
