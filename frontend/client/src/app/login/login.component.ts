import { TokenService } from './../services/token.service';
import { LoginService } from './../services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;

  constructor(private router:Router,private fb: FormBuilder,private _loginService:LoginService,private _tokenService:TokenService) {

    this.formLogin = this.fb.group({
      email  : ['', [ Validators.required, Validators.minLength(8) ]  ],
      password  : ['', [ Validators.required, Validators.minLength(4) ]  ],
    });
  }

  ngOnInit(): void {
  }


  login(){
    if ( this.formLogin.valid ) {

        this._loginService.login(this.formLogin.value).subscribe(
          (response)=>{
            const respuesta:any = response;
            if (respuesta.fail){
                alert(respuesta.fail);
            }else{
              if (respuesta.SUCCESS){
                this._tokenService.setToken(respuesta.token);
                this.router.navigate(["/productos"]);
              }else{
                alert("LOGIN FALLIDO.")
              }

            }
          },
          (responseError)=>{
            alert(responseError.error.fail);
          }
        )
    }
  }

}
