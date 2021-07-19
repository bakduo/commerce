class Repository {
  constructor(datasource) {
    this.data = datasource;
    this.items = {};
  }

  init() {
    this.items = this.data.getStore();
  }

  async clear() {
    await this.items.clear();
  }

  getSource() {
    return this.items;
  }

  include = async (value, expression_equal) => {
    const items = await this.items.getItems();
    const resultado = items.find((item) => expression_equal(item, value));
    if (resultado) {
      return { status: true, item: resultado };
    }
    return { status: false, item: null };
  };

  getId = async (id) => {
    const item = await this.items.getId(id);
    if (item) {
      return item;
    }

    return null;
  };

  getItems = async () => {
    const items = await this.items.getItems();

    if (items) {
      return items;
    }

    return null;
  };

  getIndex = async (id) => {
    const index = await this.items.getIndex(id);

    if (index >= 0) {
      return index;
    }

    return -1;
  };

  static handleError(error) {
    throw error;
  }

  delete = async (item) => {
    try {
      const itemeliminado = await this.items.delete(item);
      if (itemeliminado !== null) {
        return itemeliminado;
      }
      return null;
    } catch (error) {
      Repository.handleError(error);
      return null;
    }
  };

  deleteById = async (id) => {
    try {
      const item = await this.items.deleteById(id);
      if (item !== null) {
        return item;
      }
      return null;
    } catch (error) {
      Repository.handleError(error);
      return null;
    }
  };

  updateById = async (id, producto) => {
    try {
      const p = await this.items.updateById(id, producto);
      if (p) {
        return p;
      }
      return null;
    } catch (error) {
      Repository.handleError(error);
      return null;
    }
  };

  save = async (p) => {
    try {
      const result = await this.items.save(p);
      if (result) {
        return p;
      }
      return null;
    } catch (error) {
      Repository.handleError(error);
      return null;
    }
  };
}

module.exports = Repository;
