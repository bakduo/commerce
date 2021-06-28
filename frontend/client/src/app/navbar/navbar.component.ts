import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Carrito, CarritoService } from '../services/carrito.service';
import { ControlauthService } from '../services/controlauth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit,OnDestroy {

  productos:Carrito[] = [];
  productosCarrito$:Observable<Carrito[]>;
  productosCarritoSubScription:Subscription;

  constructor(private _controlService:ControlauthService,private _carritoService:CarritoService) { }

  ngOnInit(): void {
    this.productosCarrito$ = this._carritoService.getProductos$();
    this.productosCarritoSubScription = this.productosCarrito$.subscribe(items =>this.productos = items);
  }

  changerole():void{
    this._controlService.switchRole();
  }

  ngOnDestroy() {
    this.productosCarritoSubScription.unsubscribe();
  }

}
