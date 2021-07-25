const Repository = require('./repository');

class MessageRepository extends Repository {
  static instancia;

  constructor(obj) {
    if (!!MessageRepository.instancia) {
      return MessageRepository.instancia;
    }

    super(obj);

    MessageRepository.instancia = this;
  }
}

module.exports = MessageRepository;
