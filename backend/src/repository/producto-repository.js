const Repository = require('./repository');

class ProductoRepository extends Repository {
  static instancia;

  constructor(obj) {
    if (!!ProductoRepository.instancia) {
      return ProductoRepository.instancia;
    }

    super(obj);

    ProductoRepository.instancia = this;
  }
}

module.exports = ProductoRepository;
