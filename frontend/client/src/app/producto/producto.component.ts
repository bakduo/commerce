import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  producto: any = {};

  urlBack: string;

  constructor(private activatedRoute: ActivatedRoute,
    private _productoService: ProductoService) {

      this.urlBack=environment.backend;
      
      this.activatedRoute.params.subscribe( params =>{

        this.producto = this._productoService.getProducto(params['id']).subscribe(
          product => {
            this.producto = product;
          },
          (responseError) => {
            //console.log(error);
            alert(responseError.error.statusText);
          });;

      });
     }

  ngOnInit(): void {
  }

}
