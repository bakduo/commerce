const Repository = require('./repository');

class MessageRepository extends Repository {
  static instancia;

  constructor(datasource) {
    if (!!MessageRepository.instancia) {
      return MessageRepository.instancia;
    }

    super(datasource);

    this.init();

    if (this.getSource().getType() === 'nosql') {
      const MensajeSchema = require('../model/mensaje-schema');
      this.items.loadConfiguration('mensajes', 'Mensaje', MensajeSchema);
    } else {
      this.items.loadConfiguration('mensajes');
    }

    MessageRepository.instancia = this;
  }
}

module.exports = MessageRepository;
