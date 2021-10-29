import { LoginService } from './../services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  formSingup: FormGroup;

  constructor(private router:Router,private fb: FormBuilder,private _loginService:LoginService) {

    this.formSingup = this.fb.group({
      email  : ['', [ Validators.required, Validators.minLength(8) ]  ],
      password  : ['', [ Validators.required, Validators.minLength(4) ]  ],
      edad  : ['', [ Validators.required, Validators.minLength(2) ]  ],
      direccion  : ['', [ Validators.required, Validators.minLength(10) ]  ],
      avatar  : ['', [ Validators.required, Validators.minLength(5) ]  ],
      tel  : ['', [ Validators.required, Validators.minLength(10) ]  ],
      nombre  : ['', [ Validators.required, Validators.minLength(4) ]  ],
      pais  : new FormControl(""),
    });
  }

  ngOnInit(): void {
  }

  signup(){
    if ( this.formSingup.valid ) {

        console.log("debe enviar");
        this._loginService.signup(this.formSingup.value).subscribe(
          (response)=>{
            const respuesta:any = response;
            if (respuesta.fail){ 
                alert(respuesta.fail);
            }else{
              if (respuesta.SUCCESS){
                this.router.navigate(["/"]);
              }else{
                alert("SINGUP FALLIDO.")
              }

            }
          }
        )
    }
  }

}
