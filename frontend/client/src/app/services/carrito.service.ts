import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Producto } from './producto.service';

import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';
@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private url = environment.backend + '/api/carrito';

  productos:any[] = [];
  private productos$: Subject<any[]> = new Subject<any[]>();

  //hash:string = '';

  constructor(private http: HttpClient,private _tokenService:TokenService) {
    //this.hash = "ryvb4aqbbsHireHWlPQfxxqDHQJo6YkVYhE9imKt0b8=";
  }

  notifySubcriptor(idx:any){
    this.productos.push(idx);
    this.productos$.next(this.productos);
  }

  notifyDeleteSubcriptor(idx:any){
   this.productos = this.productos.filter((item)=>item.id!==idx);
   this.productos$.next(this.productos);
  }

  update(p:Carrito[]){
    this.productos = p;
    this.productos$.next(p);
  }

  addProducto(idx:any){
    let headersCustom = new HttpHeaders()
    .set('content-type','application/json')
    .append('Authorization','Bearer '+this._tokenService.getTokenRaw());
      return this.http.post(`${ this.url }/agregar/${idx}`,{},{headers: headersCustom});
  }

  private customResponse( carritoObj: any ) {

    const productosTemp: Carrito[] = [];

    Object.keys( carritoObj ).forEach( key => {

      const item: Carrito = carritoObj[key];
      if (item._id){
        item['id'] = item._id;
      }
      productosTemp.push( item );
    });

    return productosTemp;

  }

  // getProductosUpdate(){

  //   return this.http.get(`${ this.url }/listar`).pipe(
  //     map( this.customResponse ),
  //     delay(0)
  //   );

  // }

  getProductos$():Observable<any[]>{
    return this.productos$.asObservable();
  }

  // setHash(h:string){
  //   this.hash = h;
  // }

  // getHash(){
  //   return this.hash;
  // }

  getSize(){
    return this.productos.length;
  }

  getProductos(): Observable<any>{
    let headersCustom = new HttpHeaders()
    .set('content-type','application/json')
    .append('Authorization','Bearer '+this._tokenService.getTokenRaw());
    return this.http.get(`${ this.url }/listar`,{headers: headersCustom}).pipe(
      map( this.customResponse ),
      delay(0)
    );
  }

  getProducto(id:any){
    //return this.http.get(`${ this.url }/listar/${this.hash}?name=${name}`);
    return this.http.get(`${ this.url }/listar/${id}`);
  }

  deleteProducto(id:any){
    let headersCustom = new HttpHeaders()
    .set('content-type','application/json')
    .append('Authorization','Bearer '+this._tokenService.getTokenRaw());
    return this.http.delete(`${ this.url }/borrar/${id}`,{headers: headersCustom});
  }
}


export interface Carrito {
  id?:string,
  _id?:string,
  title:string;
  thumbail:string;
  price:number;
  timestamp:number;
  name:string;
  description:string;
  stock:number;
  code:string;
}
