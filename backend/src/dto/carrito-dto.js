const { time } = require("faker")

class CarritoDTO {

  #id
  #name
  #price
  #thumbail
  #description
  #code
  #title
  #stock
  #carrito_session
  #timestamp
  
  constructor({carrito_session,id,name,price,thumbail,stock,code,description,title,timestamp}){
      this.#id=id;
      this.#name=name;
      this.#timestamp = timestamp;
      this.#price=price;
      this.#thumbail=thumbail;
      this.#code = code;
      this.#title = title;
      this.#description = description;
      this.#stock = stock;
      this.#carrito_session = carrito_session;
  }

  setTimeStamp(t){
    this.#timestamp = t;
  }

  setCarritoSession(cs){
    this.#carrito_session = cs;
  }

  setName(name){
      this.#name=name
  }

  setPrice(p){
      this.#price=p;
  }

  setThumbail(t){
      this.#thumbail=t;
  }

  setStock(s){
    this.#stock  = s;
  }

  setTitle(t){
    this.#title = t;
  }

  setDescription(d){
    this.#description = d;
  }

  setCode(c){
    this.#code = c;
  }

  getStock(){
    return Number(this.#stock);
  }

  getId(){
      return this.#id;
  }
  getName(){
      return this.#name
  }
  getPrice(){
      return Number(this.#price);
  }

  getThumbail(){
      return this.#thumbail;
  }

  getTitle(){
    return this.#title;
  }

  getCode(){
    return this.#code;
  }

  getDescription(){
    return this.#description;
  }

  getCarritoSession(){
    return this.#carrito_session;
  }

  getTimeStamp(){
    return this.#timestamp;
  }

  toJson(){
      return {
          id:this.getId(),
          price:this.getPrice(),
          name:this.getName(),
          thumbail:this.getThumbail(),
          code: this.getCode(),
          description: this.getDescription(),
          title: this.getTitle(),
          stock: this.getStock(),
          carrito_session: this.getCarritoSession(),
          timestamp: this.getTimeStamp()
      }
  }
}

module.exports = CarritoDTO;