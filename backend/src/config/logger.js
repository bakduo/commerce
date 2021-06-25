const { createLogger, format, transports } = require('winston');

const morgan = require('morgan');

//setup logger
const logger = createLogger({
  format: format.simple(),
  transports: [new transports.Console()],
});

//setup request logger
morgan.token('id', (req) => req.id);

const requestFormat = ':remote-addr[:date[iso]] :id ":method :url" :status';

const requests = morgan(requestFormat, {
  stream: {
    write: (message) => {
      //rremove all lines breaks
      const log = message;
      return logger.info(log);
    },
  },
});

//attach to logger object
logger.requests = requests;

//format logger and attach logger object

logger.header = (req) => {
  const date = new Date().toISOString();
  return `${req.ip} [${date}] ${req.id}  "${req.method} ${req.originalUrl}`;
};

module.exports = logger;
