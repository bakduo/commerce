const Repository = require('./repository');

class CarritoRepository extends Repository {
  static instancia;

  constructor(datasource) {
    if (!!CarritoRepository.instancia) {
      return CarritoRepository.instancia;
    }

    super(datasource);

    this.init();

    if (this.getSource().getType() === 'nosql') {
      const CarritoSchema = require('../model/carrito-schema');
      this.items.loadConfiguration('Carritos', 'Carrito', CarritoSchema);
    } else {
      this.items.loadConfiguration('carritos');
    }

    CarritoRepository.instancia = this;
  }
}

module.exports = CarritoRepository;
