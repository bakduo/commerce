
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  token:string = "";
  helper:JwtHelperService;

  constructor() {
    this.token;
    this.helper = new JwtHelperService();
  }

  setToken(t:string){
    this.token = t;
  }

  // Other functions
  //const expirationDate = helper.getTokenExpirationDate(myRawToken);
  //const isExpired = helper.isTokenExpired(myRawToken);

  getToken(){

    return this.helper.decodeToken<TokenUser>(this.token);

  }

  getTokenRaw(){
    return this.token;
  }

  clearToken(){
    this.token = "";
  }

}

export interface TokenUser{
    email: String,
    role: String,
    nombre: String,
    iat: Number,
    exp: Number
}
