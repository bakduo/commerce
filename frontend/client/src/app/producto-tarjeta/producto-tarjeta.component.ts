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
  @Input() index: number;

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
      this._productoService.deleteProducto(this.index);
      this.router.navigate(["/productos"]);
  }

  editarProducto(){
    this.router.navigate(["/producto-edit",this.index]);
  }

  agregarCarrito(){
    const p = this._productoService.getProducto(this.index);
    const hash = this._carritoService.getHash();
    const c = {
      id:hash,
      timestamp:Date.now(),
      producto: p
    }
    this._carritoService.addProducto(c);
  }

}
