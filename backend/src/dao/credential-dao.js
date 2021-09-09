const GenericDAO = require('./generic-dao');

class CredentialDAO extends GenericDAO {
  static instancia;

  constructor(datasource) {
    if (!!CredentialDAO.instancia) {
      return CredentialDAO.instancia;
    }

    super(datasource);

    this.name = 'credentials';

    this.init();

    this.loadConfiguration(this);

    CredentialDAO.instancia = this;
  }

  getName() {
    return this.name;
  }
}

module.exports = CredentialDAO;
