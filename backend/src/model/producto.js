class Producto {
  constructor() {
    this.title = '';
    this.id = -1; //Math.random().toString();
    this.thumbail = '';
    this.price = 0.0;
  }

  static getProducto(title, id, thumbail, price) {
    const p = new Producto();
    p.setId(id);
    p.setPrice(price);
    p.setThumbail(thumbail);
    p.setTitle(title);
    return p;
  }

  update({ title, thumbail, price }) {
    this.title = title;
    this.price = price;
    this.thumbail = thumbail;
  }

  setTitle(t) {
    this.title = t;
  }
  setId(i) {
    this.id = i;
  }
  setThumbail(t) {
    this.thumbail = t;
  }
  setPrice(p) {
    this.price = p;
  }

  toJson() {
    //return JSON.stringify(this);
    return {
      title: this.title,
      price: this.price,
      thumbail: this.thumbail,
      id: this.id,
    };
  }
}

module.exports = Producto;
