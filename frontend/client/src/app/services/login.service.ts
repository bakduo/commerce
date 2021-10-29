import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url = environment.backend + '/api';

  constructor(private http: HttpClient,private _tokenService:TokenService) { }


  login(user:User){
    let headersCustom = new HttpHeaders()
    .set('content-type','application/json')
    return this.http.post(`${ this.url }/login`,user, {headers: headersCustom});
  }

  signup(user:SignupUser){
    let headersCustom = new HttpHeaders()
    .set('content-type','application/json')
    return this.http.post(`${ this.url }/signup`,user, {headers: headersCustom});
  }

  logout(){
    let headersCustom = new HttpHeaders()
    .set('content-type','application/json')
    .append('Authorization','Bearer '+this._tokenService.getTokenRaw());
    return this.http.post(`${ this.url }/logout`,{},{headers: headersCustom});
  }


}

export interface User {
  email:string,
  password:string,
}


export interface SignupUser {
  email:string,
  password:string,
  tel:string,
  avatar:string,
  direccion:string,
  edad:Number,
  nombre:string,
}


export interface UserOnline {
  email:string,
  role:string,
}
