/**
 * Commerces
 */

const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});
const requestId = require('express-request-id')();
const routerProductos = require('./routes/productos');
const routerCarrito = require('./routes/carrito');
const WSocket = require('./util/wsocket');
const config = require('./config/index');
const logger = require('./config/logger');
const middlewareauth = require('./middleware/fakeauth');

const { port } = config.server;

// indico donde estan los archivos estaticos
app.use(express.static('public'));
app.use(express.json());
app.use(requestId);
app.use(logger.requests);

app.use(express.urlencoded({ extended: true }));

// Auth every request
app.use(middlewareauth.fakeAuth);

app.use(cors(config.server.cors.server));

app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarrito);

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

  const log = `${logger.header(req)} ${statusCode} ${message}`;
  logger.error(log);
  res.status(statusCode);
  res.json({
    message,
  });
});

// wrapper TODO fix si crece
const customsocket = new WSocket(io);

customsocket.init();

// pongo a escuchar el servidor en el puerto indicado
const server = http.listen(port, () => {
  logger.info(`servidor socket escuchando en http://localhost:${port}`);
});

// en caso de error, avisar
server.on('error', (error) => {
  logger.error('error socket en el servidor:', error);
});

module.exports = app; // for testing
