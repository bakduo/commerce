import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Producto } from './producto.service';


@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private url = 'http://localhost:8080/api/carrito';
  productos:any[] = [];
  private productos$: Subject<any[]> = new Subject<any[]>();

  hash:string = '';

  constructor(private http: HttpClient) {
    this.hash = "ryvb4aqbbsHireHWlPQfxxqDHQJo6YkVYhE9imKt0b8=";
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
      return this.http.post(`${ this.url }/agregar/${idx}`,{});
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

  setHash(h:string){
    this.hash = h;
  }

  getHash(){
    return this.hash;
  }

  getSize(){
    return this.productos.length;
  }

  getProductos(): Observable<any>{
    return this.http.get(`${ this.url }/listar`).pipe(
      map( this.customResponse ),
      delay(0)
    );
  }

  getProducto(id:any){
    //return this.http.get(`${ this.url }/listar/${this.hash}?name=${name}`);
    return this.http.get(`${ this.url }/listar/${id}`);
  }

  deleteProducto(id:any){
    return this.http.delete(`${ this.url }/borrar/${id}`);
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
  code:number;
}
