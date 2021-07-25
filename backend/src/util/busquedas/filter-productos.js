const SearchProductos = require('./search-productos');

class FilterProductos extends SearchProductos {
  constructor(producto) {
    super(producto);
  }

  #filterProductos = async (custom) => {
    try {
      let items = [];
      for (const [key, value] of Object.entries(custom)) {
        //query = { query: { key: 'price', value: price } };
        let findItems = { query: {} };

        findItems.query['key'] = String(key);

        findItems.query['value'] = value;

        const temp = await this.item.find(findItems);

        if (temp) {
          items = items.concat(temp);
        }
      }

      return items;
    } catch (error) {
      throw new Error(error);
    }
  };

  execute = async (...args) => {
    return this.#filterProductos(args[0]);
  };
}

module.exports = FilterProductos;
