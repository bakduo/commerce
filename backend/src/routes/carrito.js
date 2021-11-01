const express = require('express');
const CarritoController = require('../controller/carrito');
const passport = require('passport');
const WPassport = require('../middleware/wpassport');
const UserDAO = require('../dao/user-dao');
const CredentialDAO = require('../dao/credential-dao');

const routerCarrito = express.Router();

const config = require('../config/index');

const userrepo = new UserDAO(config.db);

const credentialrepo = new CredentialDAO(config.db);

const CarritoDAO = require('../dao/carrito-dao');

const ProductoDAO = require('../dao/producto-dao');

const repo = new CarritoDAO(config.db);

const repoProductos = new ProductoDAO(config.db);

const controller = new CarritoController(repo, repoProductos);

const wpassport = new WPassport(userrepo, credentialrepo);

wpassport.init();

/******Control router*************/

routerCarrito.get(
  '/listar',
  passport.authenticate('jwt', { session: false }),
  controller.getProductos
);

routerCarrito.get(
  '/listar/:id',
  passport.authenticate('jwt', { session: false }),
  controller.getProducto
);

routerCarrito.post(
  '/agregar/:id',
  passport.authenticate('jwt', { session: false }),
  controller.addProducto
);

routerCarrito.delete(
  '/borrar/:id',
  passport.authenticate('jwt', { session: false }),
  controller.deleteProducto
);
/** ******************************* */

module.exports = routerCarrito;