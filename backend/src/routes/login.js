'use strict';

const express = require('express');

const passport = require('passport');
const WPassport = require('../middleware/wpassport');
const LoginController = require('../controller/login');
const routerLogin = express.Router();
const UserDAO = require('../dao/user-dao');
const CredentialDAO = require('../dao/credential-dao');

const config = require('../config/index');

const repo = new UserDAO(config.db);
const repo2 = new CredentialDAO(config.db);
const { checkJWT } = require('../middleware/check-login');

const wpassport = new WPassport(repo, repo2);
wpassport.init();

const controller = new LoginController(repo, repo2);

routerLogin.post('/login', checkJWT, controller.login);

routerLogin.post('/signup', controller.signup);

routerLogin.post('/logout', [
  passport.authenticate('jwt', { session: false })
],controller.logout);

routerLogin.delete('/delete', controller.delete);

routerLogin.get('/list', controller.list);

module.exports = routerLogin;
