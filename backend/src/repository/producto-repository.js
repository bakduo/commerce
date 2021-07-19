const Repository = require('./repository');

class ProductoRepository extends Repository {
  static instancia;

  constructor(datasource) {
    if (!!ProductoRepository.instancia) {
      return ProductoRepository.instancia;
    }

    super(datasource);

    this.init();

    if (this.getSource().getType() === 'nosql') {
      const ProductoSchema = require('../model/producto-schema');
      this.items.loadConfiguration('productos', 'Producto', ProductoSchema);
    } else {
      this.items.loadConfiguration('productos');
    }

    ProductoRepository.instancia = this;
  }

  find = async (custom) => {
    try {
      let items = [];
      for (const [key, value] of Object.entries(custom)) {
        //query = { query: { key: 'price', value: price } };
        let findItems = { query: {} };

        findItems.query['key'] = String(key);

        findItems.query['value'] = value;

        const temp = await this.items.find(findItems);

        if (temp) {
          items = items.concat(temp);
        }
      }

      return items;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
}

module.exports = ProductoRepository;
