import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Carrito, CarritoService } from '../services/carrito.service';
import { ControlauthService } from '../services/controlauth.service';
import { ProductoService } from '../services/producto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit,OnDestroy {

  productos:any[] = [];
  productosCarrito$:Observable<any[]>;
  productosCarritoSubScription:Subscription;

  form: FormGroup;

  filterList: any = ['name', 'code', 'stock','price']

  constructor(private fb: FormBuilder,private _controlService:ControlauthService,private _carritoService:CarritoService,private _productoService:ProductoService,private router:Router) {

    this.productosCarrito$ = this._carritoService.getProductos$();

    this.productosCarritoSubScription = this.productosCarrito$.subscribe(items =>{this.productos = items});

    this.form = this.fb.group({

      filter: ['', [Validators.required ]  ],
      valuefilter: ['', [ Validators.required ]  ]

    });


  }

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

  get f(){
    return this.form.controls;
  }



  changerole():void{
    this._controlService.switchRole();

  }

  clearFilter(){
    this._productoService.clearFilter();
    this.router.navigate( ['/'] );
  }

  filterSearch(){
    if ( this.form.valid ) {
      this._productoService.setFilter(this.form.value.filter,this.form.value.valuefilter);
      this.router.navigate( ['/'] );
    }

  }

  ngOnDestroy() {
   this.productosCarritoSubScription.unsubscribe();
  }

}
