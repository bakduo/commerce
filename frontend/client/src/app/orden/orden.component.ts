import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { OrdenService } from '../services/orden.service';
import { Producto } from '../services/producto.service';

@Component({
  selector: 'app-orden',
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.css']
})
export class OrdenComponent implements OnInit {

  productos: Producto[] = [];

  urlBack:string;

  totalCompra:number;

  constructor(private router:Router,private activatedRoute: ActivatedRoute,
    private _ordenService: OrdenService) {

      this.urlBack=environment.backend;
      
      this.activatedRoute.params.subscribe( params =>{

        if (params['id']!=null){
            this.initRequestProductos(params['id']);
        }else{
          this.router.navigate(["/productos"]);
        }
      
      });
     }

  ngOnInit(): void {
   
  }

  initRequestProductos(parameter:any){
    this._ordenService.getProductosOrder(parameter)
    .subscribe((products:any) => {
        this.productos = products;

        this.totalCompra = this.productos.reduce((
          acc,
          obj,
       ) => acc + (obj.price * 1),
       0);
        
      },
      (responseError) => {
        alert(responseError.error.statusText);
      });
  }

}
