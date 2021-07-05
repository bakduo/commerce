const express = require('express');

const ProductoController = require('../api/productos');

const ProductoService = require('../services/producto-sevice');

const ProductoRepository = require('../repository/producto-repository');

const routerProduct = express.Router();

const CustomOrigin = require('../middleware/custom-origin');

const CheckProducto = require('../middleware/check⁻producto');

const config = require('../config/index');

const control = new CustomOrigin();

const controlProducto = new CheckProducto();

const repo = new ProductoRepository(config.dbproducts);

const controller = new ProductoController(new ProductoService(repo), repo);
/** ***************** */

/** ****Control router************ */
routerProduct.get('/vista', controller.getVista);

routerProduct.get('/listar', controller.getProductos);

routerProduct.get('/listar/:id', control.checkIdGet, controller.getProducto);

// Same as loopback middleware
routerProduct.post(
  '/guardar',
  [control.authorize('admin'), controlProducto.checkFields],
  controller.postProducto
);

routerProduct.put(
  '/actualizar/:id',
  [control.authorize('admin'), control.checkIdGet],
  controller.putProducto
);

routerProduct.delete(
  '/borrar/:id',
  [control.authorize('admin'), control.checkIdGet],
  controller.deleteProducto
);
/** ******************************* */

module.exports = routerProduct;
