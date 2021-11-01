const express = require('express');

const OrdenController = require('../controller/orden');

const passport = require('passport');

const WPassport = require('../middleware/wpassport');

const UserDAO = require('../dao/user-dao');

const CredentialDAO = require('../dao/credential-dao');

const OrdenDAO = require('../dao/orden-dao');

const routerOrden = express.Router();

const config = require('../config/index');

const userrepo = new UserDAO(config.db);

const credentialrepo = new CredentialDAO(config.db);

const CarritoDAO = require('../dao/carrito-dao');

const ProductoDAO = require('../dao/producto-dao');

const repoCarrito = new CarritoDAO(config.db);

const repoProductos = new ProductoDAO(config.db);

const repoOrden = new OrdenDAO(config.db);

const controller = new OrdenController(repoOrden, repoProductos,repoCarrito);

const wpassport = new WPassport(userrepo, credentialrepo);

wpassport.init();
/******Control router*************/
routerOrden.get(
  '/listar',
  passport.authenticate('jwt', { session: false }),
  controller.getOrdenes
);

routerOrden.get(
  '/listar/:id',
  passport.authenticate('jwt', { session: false }),
  controller.getOrden
);

routerOrden.post(
  '/realizarpedido',
  passport.authenticate('jwt', { session: false }),
  controller.makeAndOrder
);

routerOrden.post(
  '/productos/:id',
  passport.authenticate('jwt', { session: false }),
  controller.getProductosOrden
);

routerOrden.post(
  '/user/:email',
  passport.authenticate('jwt', { session: false }),
  controller.getOrdenesUser
);

routerOrden.delete(
  '/borrar/:id',
  passport.authenticate('jwt', { session: false }),
  controller.deleteOrden
);
/**********************************/

module.exports = routerOrden;