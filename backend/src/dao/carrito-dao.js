const GenericDAO = require('./generic-dao');

class CarritoDAO extends GenericDAO {
  static instancia;

  constructor(datasource) {
    if (!!CarritoDAO.instancia) {
      return CarritoDAO.instancia;
    }

    super(datasource);

    this.init();

    this.name = 'carritos';

    this.loadConfiguration(this);

    CarritoDAO.instancia = this;
  }

  getName() {
    return this.name;
  }
}

module.exports = CarritoDAO;
