/**
 * Commerces
 */

const express = require('express');

const routerProductos = require('./routes/productos');

const handlebars = require('express-handlebars');

const WSocket = require('./util/wsocket');

const config = require('./config/index');

const logger = require('./config/logger');

const { port } = config.server;

const requestId = require('express-request-id')();

//creo una app de tipo express
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// indico donde estan los archivos estaticos
app.use(express.static('public'));

app.use(express.json());
app.use(requestId);
app.use(logger.requests);

app.use(express.urlencoded({ extended: true }));

//using handlebars

app.engine(
  'hbs',
  handlebars({
    extname: '.hbs',
    defaultLayaout: 'main.hbs',
    layoutDir: __dirname + '/views/layouts',
    partialDir: __dirname + '/views/partials',
  })
);

//app.use('/',routerProductos);//Ahora usa public para poder tener socketio client-side
app.use('/api/productos', routerProductos);

app.use((req, res, next) => {
  const mensaje = `ruta ${req.path} método ${req.method} no autorizada`;

  next({
    message: mensaje,
    error: -1,
    statusCode: 404,
    level: 'warn',
  });
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  const log = `${logger.header(req)} ${statusCode} ${message}`;

  logger.error(log);

  res.status(statusCode);
  res.json({
    message,
  });
});

app.set('view engine', 'hbs');
app.set('views', './views');

//wrapper TODO fix si crece
const customsocket = new WSocket(io);

customsocket.init();

// pongo a escuchar el servidor en el puerto indicado
const server = http.listen(port, () => {
  console.log(`servidor socket escuchando en http://localhost:${port}`);
});

// en caso de error, avisar
server.on('error', (error) => {
  console.log('error socket en el servidor:', error);
});

module.exports = app; // for testing
