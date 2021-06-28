const config = require('../config/index');

class CheckCarrito {
  constructor() {}

  controlCarrito = (req, res, next) => {
    // const session = config.id);
    // if (session.carrito === undefined || session.carrito === null) {
    //   session.carrito = { id: config.id, productos: [] };
    // }
    req.carrito = config.id;
    next();
  };
}

module.exports = CheckCarrito;
