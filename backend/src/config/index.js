const configLoad = require('config');
const app = configLoad.get('app');
const DBCustom = require('../datasource/dbcustom');
const SessionCustom = require('../session/sessioncustom');
const oneMinute = 1000 * 60;
const childProcess = require('child_process');
const stream = require('stream');

//Logger
//const supportPassport = process.env.SUPPORT_LOGIN.split(',');

//https://getpino.io/#/docs/help?id=reopening

const logThrough = new stream.PassThrough();
// Environment variables

const cwd = process.cwd();
const { env } = process;
const logPath = cwd + '/log';

const logger = require('pino')(
  {
    name: 'app-ecommercefake',
    // set the own levels
    //customLevels: levels,
    // use only the custom levels
    //useOnlyCustomLevels: true,
    level: 'error',
  },
  logThrough
);

const child = childProcess.spawn(
  process.execPath,
  [
    require.resolve('pino-tee'),
    'warn',
    `${logPath}/log.warn.log`,
    'error',
    `${logPath}/log.error.log`,
    'info',
    `${logPath}/log.info.log`,
  ],
  { cwd, env }
);

logThrough.pipe(child.stdin);
//Fin logger

const supportPassport = `${app.support_login}`.split(',');

const config = {
  server: {
    port: app.port || 3000,
    dbtype: app.db1.type,
    dbtypesession: app.db2.type,
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
  dbsession: {},
  session: {},
  logger: logger,
  timesession: oneMinute * 10,
  emails: app.emails_providers,
  email_to: `${app.email_admin}`,
  passportLogin: supportPassport,
  secret: `${app.secret}`,
  sms: app.twilio,
};

if (process.argv.length >= 3) {
  config.logger.info(process.argv);
  config.mode = process.argv[3] || 'FORK';
} else {
  config.mode = 'FORK';
}

config.db = new DBCustom({
  dbtype: config.server.dbtype,
  url: `${app.db1.connector}://${app.db1.user}:${app.db1.passwd}@${app.db1.host}:${app.db1.port}/${app.db1.dbname}`,
  dbname: `${app.db1.dbname}`,
  secure: `${app.db1.secure}`,
  schema: app.db1.schema,
  logger: config.logger,
});

config.session = new SessionCustom({
  dbtype: config.server.dbtypesession,
  host: `${app.db2.host}`,
  port: `${app.db2.port}`,
  url: `${app.db2.connector}://${app.db2.user}:${app.db2.passwd}@${app.db2.host}:${app.db2.port}/${app.db2.dbname}`,
  secure: `${app.db2.secure}`,
  logger: config.logger,
});

module.exports = config;
