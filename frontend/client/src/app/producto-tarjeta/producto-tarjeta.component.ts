import { TokenService, TokenUser } from './../services/token.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from '../services/carrito.service';
import { ControlauthService } from '../services/controlauth.service';
import { ProductoService } from '../services/producto.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-producto-tarjeta',
  templateUrl: './producto-tarjeta.component.html',
  styleUrls: ['./producto-tarjeta.component.css']
})
export class ProductoTarjetaComponent implements OnInit {

  @Input() producto: any = {};
  @Input() index: any | undefined;

  @Output() productoSeleccionado: EventEmitter<any>;

  urlBack:string;

  //role:boolean = false;

  constructor(private _tokenService:TokenService,private _carritoService:CarritoService,private router:Router,private _productoService:ProductoService) {
    this.productoSeleccionado = new EventEmitter();
    this.index = '';
    this.urlBack = environment.backend;
    //this.role = _controlService.getRole();
  }

  ngOnInit(): void {
  }

  getRole(){
    //return this.role;
    if (this.getAuth().role=='admin'){
      return true
    }
    return false;
  }

  getAuth():TokenUser{
    try {
      return this._tokenService.getToken();
    } catch (error) {
      throw new Error("No es posible obtener el auth");
    }
  }

  verProducto(){
    this.router.navigate(["/producto",this.index]);
  }

  eliminarProducto(){
      this._productoService.deleteProducto(this.index).subscribe(
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

    this._carritoService.addProducto(this.index).subscribe(
      response => {
        this._carritoService.notifySubcriptor(this.index);
      },
      error => {
        console.log(error);
      });
  }

}
