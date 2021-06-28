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
  productos:number[] = [];
  private productos$: Subject<number[]> = new Subject<number[]>();

  hash:string = '';

  constructor(private http: HttpClient) {
    this.hash = "ryvb4aqbbsHireHWlPQfxxqDHQJo6YkVYhE9imKt0b8=";
  }

  notifySubcriptor(idx:number){
    this.productos.push(idx);
    this.productos$.next(this.productos);
  }

  notifyDeleteSubcriptor(idx:number){
    this.productos = this.productos.filter((item)=>item===idx);
    this.productos$.next(this.productos);
  }

  update(p:number[]){
    this.productos = p;
    this.productos$.next(this.productos);
  }


  addProducto(idx:number){
      return this.http.post(`${ this.url }/agregar/${idx}`,{});
  }

  private customResponse( carritoObj: any ) {

    const productos: Carrito[] = [];
    const productosId: number[] = [];

    Object.keys( carritoObj ).forEach( key => {

      const item: Carrito = carritoObj[key];
      productos.push( item );
    });

    productos.forEach((item)=>productosId.push(Number(item.producto.id)));
    return productosId;

  }

  getProductosUpdate(){

    return this.http.get(`${ this.url }/listar`).pipe(
      map( this.customResponse ),
      delay(0)
    );

  }

  getProductos$():Observable<number[]>{
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
    return this.http.get(`${ this.url }/listar`);
  }

  getProducto(id:number,name:string){
    return this.http.get(`${ this.url }/listar/${this.hash}/${id}?name=${name}`);
  }

  deleteProducto(id:number){
    return this.http.delete(`${ this.url }/borrar/${id}`);
  }
}


export interface Carrito {
  id?:string,
  timestamp:number,
  producto: Producto
}
