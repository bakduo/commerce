import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-producto-edit',
  templateUrl: './producto-edit.component.html',
  styleUrls: ['./producto-edit.component.css']
})
export class ProductoEditComponent implements OnInit {

  formProducto: FormGroup;

  index:number;

  producto:any = {};

  constructor(private router:Router,private fb: FormBuilder,private activatedRoute: ActivatedRoute,private _productoService:ProductoService) {

    this.index = -1;

    this.formProducto = this.fb.group({
      name  : ['', [ Validators.required, Validators.minLength(5) ]  ],
      title  : ['', [ Validators.required, Validators.minLength(5) ]  ],
      description: ['', [Validators.required ] ],
      thumbail : ['',[Validators.required ]],
      stock   : [0, Validators.required ],
      code   : [0, Validators.required ],
      price:[0, Validators.required ],
    });

    this.activatedRoute.params.subscribe( params =>{

      this._productoService.getProducto(params['id']).subscribe(
        response => {

          this.producto = response;

          if (this.producto!==null){

            this.formProducto.reset({
              name: this.producto.name,
              title: this.producto.title,
              description: this.producto.description,
              code: this.producto.code,
              stock: this.producto.stock,
              thumbail:this.producto.thumbail,
              price:this.producto.price
            });
          }
        },
        error => {
          console.log(error);
        });

      this.index = Number(params['id']);

    });

  }

  ngOnInit(): void {
  }

  save(){
    if ( this.formProducto.valid ) {

      this._productoService.updateProducto(this.formProducto.value,this.index).subscribe(
        response => {
          this.router.navigate(["/productos"])
        },
        error => {
          console.log(error);
        });
    }
  }


}
