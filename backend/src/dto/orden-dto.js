
class OrdenDTO {
  #id
  #estado
  #productos
  #email
  #timestamp
  
  constructor({id,estado,timestamp,email,productos}){
      this.#id=id;
      this.#estado = estado;
      this.#timestamp = timestamp;
      this.#email = email;
      this.#productos = productos;
  }

  setId(idx){
    this.#id=idx;
  }

  setTimeStamp(t){
    this.#timestamp = t;
  }

  setProductos(p){
    this.#productos = p;
  }

  setEmail(e){
      this.#email=e
  }

  setEstado(p){
      this.#estado=e;
  }

  getId(){
      return this.#id;
  }
  getEstado(){
      return this.#estado
  }
  getTimeStamp(){
      return Number(this.#timestamp);
  }

  getProductos(){
    return this.#productos;
  }

  getEmail(){
    return this.#email;
  }
  
  toJson(){
      return {
          id:this.getId(),
          estado:this.getEstado(),
          email:this.getEmail(),
          productos:this.getProductos(),
          timestamp:this.getTimeStamp()
      }
  }
}

module.exports = OrdenDTO;