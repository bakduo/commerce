// Update with your config settings.

const dotenv = require('dotenv');

const path = require('path');

dotenv.config({
  path: path.resolve('./', process.env.NODE_ENV + '.env'),
});

module.exports = {
  // development: {
  //   client: 'sqlite3',
  //   connection: {
  //     filename: 'db/db.sqlite',
  //   },
  //   useNullAsDefault: true,
  // },
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DBMYSQL_HOST,
      user: process.env.DBMYSQL_USER,
      password: process.env.DBMYSQL_PASSWD,
      database: process.env.DBMYSQL_DBNAME,
      port: process.env.DBMYSQL_PORT,
    },
  },
};
