class Producto {
  constructor() {
    this.title = '';
    this.id = -1; //Math.random().toString();
    this.thumbail = '';
    this.price = 0.0;
    this.timestamp = Date.now();
    this.name = '';
    this.description = '';
    this.stock = -1;
    this.code = '';
  }

  static getProductoByJson({
    title,
    id,
    thumbail,
    price,
    stock,
    code,
    description,
    name,
  }) {
    const p = new Producto();
    p.setId(id);
    p.setPrice(price);
    p.setThumbail(thumbail);
    p.setTitle(title);
    p.setName(name);
    p.setDescription(description);
    p.setCode(code);
    p.setStock(stock);
    p.timestamp = Date.now();
    return p;
  }

  static getProducto(
    title,
    id,
    thumbail,
    price,
    stock,
    code,
    description,
    name
  ) {
    const p = new Producto();
    p.setId(id);
    p.setPrice(price);
    p.setThumbail(thumbail);
    p.setTitle(title);
    p.setName(name);
    p.setDescription(description);
    p.setCode(code);
    p.setStock(stock);
    p.timestamp = Date.now();
    return p;
  }

  setStock = async (s) => {
    this.stock = s;
  };

  setName = async (n) => {
    this.name = n;
  };

  setCode = async (c) => {
    this.code = c;
  };

  setDescription = async (d) => {
    this.description = d;
  };

  update = async ({
    title,
    thumbail,
    price,
    code,
    stock,
    description,
    name,
  }) => {
    this.title = title;
    this.price = price;
    this.thumbail = thumbail;
    this.code = code;
    this.description = description;
    this.stock = stock;
    this.name = name;
    this.timestamp = Date.now();
  };

  setTitle = async (t) => {
    this.title = t;
  };
  setId = async (i) => {
    this.id = i;
  };
  setThumbail = async (t) => {
    this.thumbail = t;
  };
  setPrice = async (p) => {
    this.price = p;
  };

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
