import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';
import { Producto } from './producto.service';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  private url = environment.backend + '/api/orden';

  private ordenes:Orden[] = [];

  constructor(private http: HttpClient,private _tokenService:TokenService) { }


  addOrden(orden:Orden){
    this.ordenes.push(orden);
  }

  getOrdenesUser():Orden[]{
    return this.ordenes;
  }

  getOrden(email:any):any{

    return this.ordenes.find((item)=>{
      return (item.email==email);
    });

  }

  makeAndOrder(){
    let headersCustom = new HttpHeaders()
    .set('content-type','application/json')
    .append('Authorization','Bearer '+this._tokenService.getTokenRaw());
      return this.http.post(`${ this.url }/realizarpedido`,{},{headers: headersCustom});
  }

  getProductosOrder(id:any){
    let headersCustom = new HttpHeaders()
    .set('content-type','application/json')
    .append('Authorization','Bearer '+this._tokenService.getTokenRaw());
    return this.http.post(`${ this.url }/productos/${id}`,{},{headers: headersCustom});
  }

  getOrdenesOfUser(email:any){
    let headersCustom = new HttpHeaders()
    .set('content-type','application/json')
    .append('Authorization','Bearer '+this._tokenService.getTokenRaw());
    return this.http.post(`${ this.url }/user/${email}`,{},{headers: headersCustom});
  }

  getOrder(id:any){
    let headersCustom = new HttpHeaders()
    .set('content-type','application/json')
    .append('Authorization','Bearer '+this._tokenService.getTokenRaw());
    return this.http.post(`${ this.url }/listar/${id}`,{},{headers: headersCustom});
  }

}

export interface Orden {
  id?:string,
  _id?:string,
  estado:string;
  email:string;
  timestamp:number;
  productos:Producto[];
}
