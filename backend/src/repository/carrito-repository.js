const Repository = require('./repository');

class CarritoRepository extends Repository {
  static instancia;

  constructor(datasource) {
    super(datasource);
    if (!!CarritoRepository.instancia) {
      return DBCustom.instancia;
    }

    this.items.setMathItem(function (carrito, id) {
      return carrito.id === id;
    });

    this.items.setPersistence(process.env.DBPATHCARRITO);
    this.items.reloadFromFile();
    CarritoRepository.instancia = this;
  }

  getProductos = async () => {
    await this.items.reloadFromFile();
  };
}

module.exports = CarritoRepository;
