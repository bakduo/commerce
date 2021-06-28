import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {


  private url = 'http://localhost:8080/api/productos';

  private productos:Producto[] = [

    {
      title:'sample1',
      id:0,
      thumbail:'sample thumbail',
      price:11,
      timestamp:Date.now(),
      name:'sample name',
      description:'descrip sample1',
      stock:11,
      code:11111
    },
    {
      title:'sample2',
      id:1,
      thumbail:'sample thumbail 2',
      price:12,
      timestamp:Date.now(),
      name:'sample name',
      description:'descrip sample2',
      stock:12,
      code:11112
    },
  ]

  constructor(private http: HttpClient) { }

  getProductos(): Observable<any> {
    return this.http.get(`${ this.url }/listar`);
  }

  getProducto(id:number){
    return this.http.get(`${ this.url }/listar/${id}`);
  }

  addProducto(p:Producto){
    let headersCustom = new HttpHeaders()
    .set('content-type','application/json')
    .append('x-api-custom','true');
    return this.http.post(`${ this.url }/guardar`,p, {headers: headersCustom});
  }

  updateProducto(p:Producto,id:number){

    let headersCustom = new HttpHeaders()
    .set('content-type','application/json')
    .append('x-api-custom','true');
    return this.http.put(`${ this.url }/actualizar/${id}`,p,{headers: headersCustom});
  }

  deleteProducto(id:number){
    let headersCustom = new HttpHeaders()
    .set('content-type','application/json')
    .append('x-api-custom','true');
    return this.http.delete(`${ this.url }/borrar/${id}`,{headers: headersCustom});
  }

}

export interface Producto{
  title:string;
  id?:number;
  thumbail:string;
  price:number;
  timestamp:number;
  name:string;
  description:string;
  stock:number;
  code:number;
}
