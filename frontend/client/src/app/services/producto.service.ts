import { TokenService } from './token.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {


  private url = environment.backend + '/api/productos';

  private productos:Producto[] = [];

  private filterStr = '';

  constructor(private http: HttpClient,private _tokenService:TokenService) { }

  private customResponse( productoObj: any ) {

    const productos: Producto[] = [];

    Object.keys( productoObj ).forEach( key => {

      const item: Producto = productoObj[key];
      if (item._id){
        item['id'] = item._id;
      }

      productos.push( item );
    });

    //productos.forEach((item)=>productosId.push(Number(item.producto.id)));
    return productos;

  }

  clearFilter(){
    this.filterStr = '';
  }

  setFilter(filter:string,value:any){
    this.filterStr = `${filter}=${value}`;
  }

  getFilter():string{
    return this.filterStr;
  }

  getProductos(): Observable<any> {

    if (this.getFilter().length>0){
      return this.http.get(`${ this.url }/listar?`+this.getFilter()).pipe(
        map( this.customResponse ),
        delay(0));
    }
    return this.http.get(`${ this.url }/listar`).pipe(
      map( this.customResponse ),
      delay(0));
  }

  getProducto(id:any){
    return this.http.get(`${ this.url }/listar/${id}`);
  }

  /*
  Es neceario agregar para el token
  Authorization: Bearer XXXXXX token
  .append('x-api-custom','true');
  */
  addProducto(p:Producto){
    let headersCustom = new HttpHeaders()
    .set('content-type','application/json')
    .append('Authorization','Bearer '+this._tokenService.getTokenRaw());
    return this.http.post(`${ this.url }/guardar`,p, {headers: headersCustom});
  }

  updateProducto(p:Producto,id:any){

    let headersCustom = new HttpHeaders()
    .set('content-type','application/json')
    .append('Authorization','Bearer '+this._tokenService.getTokenRaw());
    return this.http.put(`${ this.url }/actualizar/${id}`,p,{headers: headersCustom});
  }

  deleteProducto(id:any){
    let headersCustom = new HttpHeaders()
    .set('content-type','application/json')
    .append('Authorization','Bearer '+this._tokenService.getTokenRaw());
    return this.http.delete(`${ this.url }/borrar/${id}`,{headers: headersCustom});
  }

}

export interface Producto{
  title:string;
  id?:string;
  _id?:string;
  thumbail:string;
  price:number;
  timestamp:number;
  name:string;
  description:string;
  stock:number;
  code:string;
}
