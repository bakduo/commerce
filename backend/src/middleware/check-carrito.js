const config = require('../config/index');

class CheckCarrito {
  constructor() {}

  controlCarrito = async (req, res, next) => {
    req.carrito = config.id;
    next();
  };
}

module.exports = CheckCarrito;
