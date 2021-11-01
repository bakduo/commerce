class ProductoDTO {

  #id
  #name
  #price
  #thumbail
  #description
  #code
  #title
  #stock
  
  constructor({id,name,price,thumbail,stock,code,description,title,_id}){
      this.#id=id || _id;
      this.#name=name;
      this.#price=price;
      this.#thumbail=thumbail;
      this.#code = code;
      this.#title = title;
      this.#description = description;
      this.#stock = stock;
  }

  setId(id){
    this.#id = id;
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
    return this.#stock;
  }

  getId(){
      return this.#id;
  }
  getName(){
      return this.#name
  }
  getPrice(){
      return this.#price;
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

  toJson(){
      return {
          id:this.getId(),
          price:this.getPrice(),
          name:this.getName(),
          thumbail:this.getThumbail(),
          code: this.getCode(),
          description: this.getDescription(),
          title: this.getTitle(),
          stock: this.getStock()
      }
  }
}

module.exports = ProductoDTO;