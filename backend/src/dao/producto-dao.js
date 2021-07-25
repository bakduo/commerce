const GenericDAO = require('./generic-dao');

class ProductoDAO extends GenericDAO {
  static instancia;

  constructor(datasource) {
    if (!!ProductoDAO.instancia) {
      return ProductoDAO.instancia;
    }

    super(datasource);

    this.name = 'productos';

    this.init();

    this.loadConfiguration(this);

    ProductoDAO.instancia = this;
  }

  getName() {
    return this.name;
  }
}

module.exports = ProductoDAO;
