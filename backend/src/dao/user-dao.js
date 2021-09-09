const GenericDAO = require('./generic-dao');

class UserDAO extends GenericDAO {
  static instancia;

  constructor(datasource) {
    if (!!UserDAO.instancia) {
      return UserDAO.instancia;
    }

    super(datasource);

    this.name = 'users';

    this.init();

    this.loadConfiguration(this);

    UserDAO.instancia = this;
  }

  getName() {
    return this.name;
  }
}

module.exports = UserDAO;
