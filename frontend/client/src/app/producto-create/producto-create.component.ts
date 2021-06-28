import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-producto-create',
  templateUrl: './producto-create.component.html',
  styleUrls: ['./producto-create.component.css']
})
export class ProductoCreateComponent implements OnInit {


  formProducto: FormGroup;

  constructor(private router:Router,private fb: FormBuilder,
    private _productoService:ProductoService) {

      this.formProducto = this.fb.group({
        name  : ['', [ Validators.required, Validators.minLength(5) ]  ],
        title  : ['', [ Validators.required, Validators.minLength(5) ]  ],
        description: ['', [Validators.required ] ],
        thumbail : ['',[Validators.required ]],
        stock   : [0, Validators.required ],
        code   : [0, Validators.required ],
        price:[0, Validators.required ],
      });

    }

  ngOnInit(): void {

  }

  save(){
    if ( this.formProducto.valid ) {
      this._productoService.addProducto(this.formProducto.value);
      this.router.navigate(["/productos"]);
    }
  }


}
