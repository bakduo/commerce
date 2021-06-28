import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  producto: any = {};

  constructor(private activatedRoute: ActivatedRoute,
    private _productoService: ProductoService) {

      this.activatedRoute.params.subscribe( params =>{

        this.producto = this._productoService.getProducto(params['id']).subscribe(
          product => {
            this.producto = product;
            console.log(product);
          },
          error => {
            console.log(error);
          });;

      });
     }

  ngOnInit(): void {
  }

}
