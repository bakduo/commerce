const config = require('../config/index.js');
const logger = config.logger;

class SMService {
  constructor() {
    this.token = config.sms.token;
    this.sid = config.sms.id;
    this.fromtel = config.sms.fromtel;
    this.client = require('twilio')(this.sid, this.token);
  }

  send(body, to) {
    try {
      logger.info('###################INICIA SMS#######################');
      this.client.messages
        .create({
          body: body,
          from: this.fromtel,
          to: to,
        })
        .then((message) => {
          logger.info('###############FINALIZA SMS ################');
          const {
            sid,
            direction,
            from,
            to,
            price,
            errorMessage,
            status,
            dateCreated,
          } = message;
          const detailMessage = {
            sid,
            direction,
            from,
            to,
            price,
            errorMessage,
            status,
            dateCreated,
          };
          logger.info(detailMessage);
        })
        .catch((error) => {
          logger.error('###############ERROR SMS ################');
          const { status, code, moreinfo, detail } = error;
          const detailError = { status, code, moreinfo, detail };
          logger.error(detailError);
        });
    } catch (error) {
      throw new Error('Error al enviar mensajes');
    }
  }
}

module.exports = SMService;
