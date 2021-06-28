import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {


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

  constructor() { }

  getProductos():Producto[]{
    return this.productos;
  }

  getProducto(id:number){
    return this.productos[id];
  }

  addProducto(p:Producto){
    this.productos.push(p);
  }

  updateProducto(p:Producto,index:number){
      console.log(p);
      let producto = this.productos.find((item)=>item.id===index);
      if (producto){
          this.productos[index] = p;
      }
  }

  deleteProducto(id:number){
    this.productos = this.productos.filter((item)=>item.id===id);
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
