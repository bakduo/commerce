/**
 * Commerce
 */
const express = require('express');
const cors = require('cors');
const app = express();

const requestId = require('express-request-id')();
const routerProductos = require('./routes/productos');
const routerCarrito = require('./routes/carrito');
const routerLogin = require('./routes/login');

const config = require('./config/index');
const logger = config.logger;
//const session = require('express-session');
const passport = require('passport');
const compression = require('compression');

const logMiddleware = require('express-pino-logger')({
  // specify the logger
  logger: logger,
  // level to log
  useLevel: 'info',
});

app.use(logMiddleware);

app.use(compression({ filter: shouldCompress, level: 6 }));
//Check compresion
//https://github.com/expressjs/compression
function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    logger.info('Desde header');
    // don't compress responses with this request header
    return false;
  }
  // fallback to standard filter function
  return compression.filter(req, res);
}

// indico donde estan los archivos estaticos
app.use(express.static('public'));
app.use(express.json());
app.use(requestId);
//app.use(logger.requests);
app.use(express.urlencoded({ extended: true }));

//Uso token en lugar de session
//initialize session
// app.use(
//   session({
//     secret: 'cec29af85316b284fe1a6cc26a71b1',
//     store: config.session.getStore().getConnection(),
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: config.timesession, expires: config.timesession },
//   })
// );

// Auth every request
//app.use(middlewareauth.fakeAuth);
app.use(cors(config.server.cors.server));
app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarrito);
app.use('/api', routerLogin);

app.use((req, res, next) => {
  const mensaje = {
    error: -1,
    description: `ruta ${req.path} método ${req.method} no autorizada`,
  };

  next({
    message: mensaje,
    statusCode: 404,
    level: 'warn',
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  //const log = `${logger.header(req)} ${statusCode} ${message}`;
  logger.error(log);
  res.status(statusCode);
  res.json({
    message,
  });
});

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

module.exports = app;
