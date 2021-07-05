const Repository = require('./repository');

class MessageRepository extends Repository {
  static instancia;

  constructor(datasource) {
    if (!!MessageRepository.instancia) {
      return MessageRepository.instancia;
    }
    super(datasource);

    this.items.setTable('messages');

    MessageRepository.instancia = this;
  }
}

module.exports = MessageRepository;
