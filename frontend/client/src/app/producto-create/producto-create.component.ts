import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-producto-create',
  templateUrl: './producto-create.component.html',
  styleUrls: ['./producto-create.component.css']
})
export class ProductoCreateComponent implements OnInit {


  formProducto: FormGroup;
  formSubmitted:boolean = false;

  constructor(private router:Router,private fb: FormBuilder,
    private _productoService:ProductoService) {

      this.formProducto = this.fb.group({
        name  : ['', [ Validators.required, Validators.minLength(3) ]  ],
        title  : ['', [ Validators.required, Validators.minLength(3) ]  ],
        description: ['', [Validators.required ] ],
        thumbail : ['',[Validators.required ]],
        thumbailsrc : ['',[Validators.required ]],
        stock   : [0, Validators.required ],
        code   : ['', Validators.required ],
        price:[0, Validators.required ],
      });

    }

  ngOnInit(): void {
  }


  onFileChange(event:any) {
    if (event.target.files && event.target.files[0]) {

     let reader = new FileReader();
    
     reader.onload = (event:any) => {

        this.formProducto.patchValue({
          thumbailsrc: event.target.result
        });
      }
     reader.readAsDataURL(event.target.files[0]);

    }
  }

  save(){
    this.formSubmitted = true;
    if ( this.formProducto.valid ) {
      this._productoService.addProducto(this.formProducto.value)
      .subscribe(
        (response) => {
          const respuesta:any = response;
          if (respuesta.status){
            //FIX sweetAlert
            alert("Los datos del formulario no están correctos: " + respuesta.status);
          }else{
            this.router.navigate(["/productos"]);
          }
        },
        (responseError) => {
          //console.log(error);
          alert(responseError.error.statusText);
        });
    }
  }


}
