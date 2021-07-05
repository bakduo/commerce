const Repository = require('./repository');

class ProductoRepository extends Repository {
  static instancia;

  constructor(datasource) {
    if (!!ProductoRepository.instancia) {
      return ProductoRepository.instancia;
    }
    super(datasource);
    if (datasource.type.dbtype !== 'knex') {
      this.items.setMathItem(function (producto, id) {
        return producto.id === id;
      });
      this.items.setPersistence(process.env.DBPATHPRODUCTOS);
      this.items.reloadFromFile();
    } else {
      this.items.setTable('productos');
    }

    ProductoRepository.instancia = this;
  }
}

module.exports = ProductoRepository;
