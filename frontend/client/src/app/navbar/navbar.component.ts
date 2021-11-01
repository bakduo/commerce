import { TokenService, TokenUser } from './../services/token.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Carrito, CarritoService } from '../services/carrito.service';
import { ControlauthService } from '../services/controlauth.service';
import { ProductoService } from '../services/producto.service';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { OrdenService } from '../services/orden.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit,OnDestroy {

  productos:any[] = [];
  productosCarrito$:Observable<any[]>;
  productosCarritoSubScription:Subscription;

  user:TokenUser;
  
  form: FormGroup;

  filterList: any = ['name', 'code', 'stock','price']

  constructor(private _loginService: LoginService,
    private _ordenService:OrdenService,
    private _tokenService:TokenService,private fb: FormBuilder,private _controlService:ControlauthService,private _carritoService:CarritoService,private _productoService:ProductoService,private router:Router) {

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
      (responseError) => {
        //console.log(error);
      });
  }

  getAuth(){
    try {
      if (this._tokenService.getToken()){
        this.user = this._tokenService.getToken();

        return true
      }
      return false
    } catch (error) {
      throw new Error("No es posible obtener el auth");
    }
  }

  get f(){
    return this.form.controls;
  }


  logout(){
    this._loginService.logout().subscribe((response:any)=>{
      if (response.SUCCESS){
        this._tokenService.clearToken();
        this.router.navigate( ['/'] );
      }else{
        alert("No fue posible realizar logout de forma efectiva. Intente mas tarde");
      }
    })
    
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

  realizarpedido(){
    this._ordenService.makeAndOrder()
    .subscribe(
      (response:any) => {
        if (response.status){
                        
            this._ordenService.addOrden(response.orden);

            alert("Su pedido fue generado...");

        }else{
          alert(response.fail);
        }
      },
      (responseError) => {
        alert(responseError.error.fail);
      });

  }

  ngOnDestroy() {
   this.productosCarritoSubScription.unsubscribe();
  }

}
