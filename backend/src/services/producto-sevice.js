const Producto = require('../model/producto.js');

//all logic for business

class ProductoService {
  constructor(repo) {
    this.repository = repo;
  }
}

module.exports = ProductoService;
