const express = require('express');

const ProductoController = require('../api/productos');

//const ProductoRepository = require('../repository/producto-repository');

const ProductoDAO = require('../dao/producto-dao');

const routerProduct = express.Router();

const CustomOrigin = require('../middleware/custom-origin');

const CheckProducto = require('../middleware/check⁻producto');

const config = require('../config/index');

const control = new CustomOrigin();

const controlProducto = new CheckProducto();

const repo = new ProductoDAO(config.db);

const controller = new ProductoController(repo);
/** ***************** */

/** ****Control router************ */
routerProduct.get('/vista', controller.getVista);

routerProduct.get('/listar', controller.getProductos);

routerProduct.get('/listar/:id', control.checkIdGet, controller.getProducto);

routerProduct.post(
  '/guardar',
  control.authorize('admin'),
  controller.postProducto
);

routerProduct.put(
  '/actualizar/:id',
  control.authorize('admin'),
  controller.putProducto
);

routerProduct.delete(
  '/borrar/:id',
  control.authorize('admin'),
  controller.deleteProducto
);
/** ******************************* */

module.exports = routerProduct;
