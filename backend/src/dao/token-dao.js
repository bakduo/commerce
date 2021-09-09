const GenericDAO = require('./generic-dao');

class TokenDAO extends GenericDAO {
  static instancia;

  constructor(datasource) {
    if (!!TokenDAO.instancia) {
      return TokenDAO.instancia;
    }

    super(datasource);

    this.name = 'tokens';

    this.init();

    this.loadConfiguration(this);

    TokenDAO.instancia = this;
  }

  getName() {
    return this.name;
  }
}

module.exports = TokenDAO;
