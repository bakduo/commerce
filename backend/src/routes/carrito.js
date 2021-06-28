const express = require('express');

const CarritoController = require('../api/carrito');

const routerCarrito = express.Router();

const config = require('../config/index');

const CheckCarrito = require('../middleware/check-carrito');

const CarritoRepository = require('../repository/carrito-repository');

const ProductoRepository = require('../repository/producto-repository');

const repo = new CarritoRepository(config.db);

const repoProductos = new ProductoRepository(config.db);

const controller = new CarritoController(repo, repoProductos);

const mcarrito = new CheckCarrito();

/******Control router*************/

routerCarrito.get('/listar', mcarrito.controlCarrito, controller.getProductos);

routerCarrito.get(
  '/listar/:id',
  mcarrito.controlCarrito,
  controller.getProducto
);

//Same as loopback middleware
routerCarrito.post(
  '/agregar/:id',
  mcarrito.controlCarrito,
  controller.addProducto
);

routerCarrito.delete(
  '/borrar/:id',
  mcarrito.controlCarrito,
  controller.deleteProducto
);
/**********************************/

module.exports = routerCarrito;
