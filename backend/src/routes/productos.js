const express = require('express');

const ProductoController = require('../api/productos');

const ProductoService = require('../services/producto-sevice');

const ProductoRepository = require('../repository/producto-repository');

const routerProduct = express.Router();

const CustomOrigin = require('../middleware/custom-origin');

const config = require('../config/index');

const control = new CustomOrigin();

const repo = new ProductoRepository(config.db);

const controller = new ProductoController(new ProductoService(repo), repo);
/********************/

/******Control router*************/
routerProduct.get('/vista', controller.getVista);

routerProduct.get('/listar', controller.getProductos);

routerProduct.get('/listar/:id', control.checkIdGet, controller.getProducto);

routerProduct.post('/guardar', control.checkForm, controller.postProducto);

routerProduct.put(
  '/actualizar/:id',
  control.checkIdGet,
  controller.putProducto
);

routerProduct.delete(
  '/borrar/:id',
  control.checkIdGet,
  controller.deleteProducto
);
/**********************************/

module.exports = routerProduct;
