const SearchProductos = require('./search-productos');

class IncludeProductos extends SearchProductos {
  constructor(producto) {
    super(producto);
  }

  #includeProductos = async (value, expression_equal) => {
    const items = await this.item.getItems();
    const resultado = items.find((item) => expression_equal(item, value));
    if (resultado) {
      return { status: true, item: resultado };
    }
    return { status: false, item: null };
  };

  execute = async (...args) => {
    return await this.#includeProductos(args[0], args[1]);
  };
}

module.exports = IncludeProductos;
