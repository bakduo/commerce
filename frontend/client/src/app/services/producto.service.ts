import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {


  private url = 'http://localhost:8080/api/productos';

  private productos:Producto[] = [];

  private filterStr = '';

  constructor(private http: HttpClient) { }

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

  getProducto(id:number){
    return this.http.get(`${ this.url }/listar/${id}`);
  }

  addProducto(p:Producto){
    let headersCustom = new HttpHeaders()
    .set('content-type','application/json')
    .append('x-api-custom','true');
    return this.http.post(`${ this.url }/guardar`,p, {headers: headersCustom});
  }

  updateProducto(p:Producto,id:any){

    let headersCustom = new HttpHeaders()
    .set('content-type','application/json')
    .append('x-api-custom','true');
    return this.http.put(`${ this.url }/actualizar/${id}`,p,{headers: headersCustom});
  }

  deleteProducto(id:any){
    let headersCustom = new HttpHeaders()
    .set('content-type','application/json')
    .append('x-api-custom','true');
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
  code:number;
}
