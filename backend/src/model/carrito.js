class Carrito {
  constructor() {
    this.id = -1;
    this.timestamp = Date.now();
    this.producto = {};
  }

  updateByJson = async (id, producto) => {
    this.id = id;
    this.producto = producto;
    this.timestamp = Date.now();
  };

  static getCarrito(id, producto) {
    const c = new Carrito();
    c.producto = producto;
    c.timestamp = Date.now();
    c.id = id;
    return c;
  }

  setId = async (id) => {
    this.id = id;
  };

  getId = async () => {
    return thid.id;
  };

  getProducto = async () => {
    return this.producto;
  };
}

module.exports = Carrito;
