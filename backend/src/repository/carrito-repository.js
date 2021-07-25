const Repository = require('./repository');

class CarritoRepository extends Repository {
  static instancia;

  constructor(obj) {
    if (!!CarritoRepository.instancia) {
      return CarritoRepository.instancia;
    }

    super(obj);

    CarritoRepository.instancia = this;
  }
}

module.exports = CarritoRepository;
