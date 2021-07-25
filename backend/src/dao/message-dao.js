const GenericDAO = require('./generic-dao');

class MessageDAO extends GenericDAO {
  static instancia;

  constructor(datasource) {
    if (!!MessageDAO.instancia) {
      return MessageDAO.instancia;
    }

    super(datasource);

    this.init();

    this.name = 'mensajes';

    this.loadConfiguration(this);

    MessageDAO.instancia = this;
  }

  getName() {
    return this.name;
  }
}

module.exports = MessageDAO;
