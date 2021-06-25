const dotenv = require('dotenv');

const path = require('path');

dotenv.config({
  path: path.resolve('./', process.env.NODE_ENV + '.env'),
});

const DBCustom = require('../datasource/dbcustom');

const config = {
  server: {
    port: process.env.PORT || 3000,
    dbtype: process.env.DBTYPE || 'memory',
  },
  db: {},
};

config.db = new DBCustom({
  dbtype: config.server.dbtype,
});

if (config.server.dbtype === 'file') {
  const reload = async () => {
    await config.db.reloadFromFile();
  };

  reload();
}

module.exports = config;
