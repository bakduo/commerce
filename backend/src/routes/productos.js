const express = require('express');

const ProductoController = require('../api/productos');
const passport = require('passport');
const WPassport = require('../middleware/wpassport');
const UserDAO = require('../dao/user-dao');
const CredentialDAO = require('../dao/credential-dao');
const ProductoDAO = require('../dao/producto-dao');

const routerProduct = express.Router();

const CustomOrigin = require('../middleware/custom-origin');

const config = require('../config/index');

const userrepo = new UserDAO(config.db);

const credentialrepo = new CredentialDAO(config.db);

const control = new CustomOrigin();

const repo = new ProductoDAO(config.db);

const controller = new ProductoController(repo);

const wpassport = new WPassport(userrepo, credentialrepo);
wpassport.init();

routerProduct.get('/vista', controller.getVista);
routerProduct.get('/listar', controller.getProductos);
routerProduct.get('/listar/:id', control.checkIdGet, controller.getProducto);

routerProduct.post(
  '/guardar',
  [
    passport.authenticate('jwt', { session: false }),
    control.authorize('admin'),
  ],
  controller.postProducto
);

routerProduct.put(
  '/actualizar/:id',
  [
    passport.authenticate('jwt', { session: false }),
    control.authorize('admin'),
  ],
  controller.putProducto
);

routerProduct.delete(
  '/borrar/:id',
  [
    passport.authenticate('jwt', { session: false }),
    control.authorize('admin'),
  ],
  controller.deleteProducto
);
/**********************************/

module.exports = routerProduct;
