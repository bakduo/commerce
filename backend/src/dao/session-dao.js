const GenericDAO = require('./generic-dao');

class SessionDAO extends GenericDAO {
  static instancia;

  constructor(datasource) {
    if (!!SessionDAO.instancia) {
      return SessionDAO.instancia;
    }

    super(datasource);

    this.name = 'sessions';

    this.init();

    this.loadConfiguration(this);

    SessionDAO.instancia = this;
  }

  getName() {
    return this.name;
  }
}

module.exports = SessionDAO;
