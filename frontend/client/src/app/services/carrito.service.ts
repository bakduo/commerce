import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Producto } from './producto.service';


@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  productos:Carrito[] = [];

  private productos$: Subject<Carrito[]> = new Subject<Carrito[]>();

  hash:string = '';

  constructor() {
    this.hash = "ryvb4aqbbsHireHWlPQfxxqDHQJo6YkVYhE9imKt0b8=";
  }

  addproductoById(idx:number){

  }

  addProducto(c:Carrito){

      this.productos.push(c);
      this.productos$.next(this.productos);
  }

  getProductos$():Observable<Carrito[]>{
    return this.productos$.asObservable();
  }

  setHash(h:string){
    this.hash = h;
  }

  getHash(){
    return this.hash;
  }

  getProductos(id:string):Producto[]{
    const items = this.productos.map((items)=>items.producto);
    return items;
  }

  getProducto(id:number){
    const item = this.productos.find((item)=>item.producto.id === id);
    return item;
  }

  deleteProducto(id:number){
    this.productos = this.productos.filter((item)=>item.producto.id===id);
  }
}


export interface Carrito {
  id?:string,
  timestamp:number,
  producto: Producto
}
