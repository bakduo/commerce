'use strict';

const WSocket = require('../src/util/wsocket');
const app = require('../src/app');
const cluster = require('cluster');
const config = require('../src/config/index');
const { port } = config.server;
const { logger } = config;
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});

// wrapper TODO fix si crece
const customsocket = new WSocket(io);
customsocket.init();

// pongo a escuchar el servidor en el puerto indicado
let cantidad = 0;

if (config.mode === 'CLUSTER') {
  const numCPUs = require('os').cpus().length;
  if (cluster.isMaster) {
    logger.info(`PID MASTER ${process.pid}`);
    if (cantidad < numCPUs) {
      cluster.fork(); // creamos un worker para cada cpu
      cantidad = cantidad + 1;
    }
    // controlamos la salida de los workers
    cluster.on('exit', (worker) => {
      cantidad = cantidad - 1;
      logger.info('Worker', worker.process.pid, 'died');
      if (cantidad < numCPUs) {
        cluster.fork(); // creamos un worker para cada cpu
        cantidad = cantidad + 1;
      }
    });
  } else {
    if (cluster.isWorker) {
      logger.info('Worker modo cluster');
      const server = http.listen(port, () => {
        logger.info(`servidor socket escuchando en http://localhost:${port}`);
      });
      // en caso de error, avisar
      server.on('error', (error) => {
        logger.info('error socket en el servidor:', error);
      });
    }
  }
} else {
  const server = http.listen(port, () => {
    logger.info(`servidor socket escuchando en http://localhost:${port}`);
  });
  // en caso de error, avisar
  server.on('error', (error) => {
    logger.info('error socket en el servidor:', error);
  });
}
