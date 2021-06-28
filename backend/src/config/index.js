const dotenv = require('dotenv');

const path = require('path');

dotenv.config({
  path: path.resolve('./', process.env.NODE_ENV + '.env'),
});

const DBCustom = require('../datasource/dbcustom');

const crypto = require('crypto');

const hash = crypto.createHash('sha256').update('sample').digest('base64'); //a falta session se usa un hash fake

const config = {
  server: {
    port: process.env.PORT || 3000,
    dbtype: process.env.DBTYPE || 'memory',
    cors: {
      server: [
        {
          origin: 'localhost:4200', //Para acceso desde angular front
          credentials: true,
        },
      ],
    },
  },
  db: {},
  id: hash,
  session: {},
};

config.db = new DBCustom({
  dbtype: config.server.dbtype,
});
module.exports = config;
