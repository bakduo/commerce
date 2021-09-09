class GenericDAO {
  //caso ejemplo una DB memory

  constructor(datasource) {
    this.data = datasource;
    this.items = {};
  }

  loadConfiguration(obj) {
    this.items.loadConfiguration(obj.getName());
  }

  getModel() {
    return this.items.getModel();
  }

  init() {
    this.items = this.data.getStore();
  }

  deleteAll = async () => {
    return await this.items.deleteAll();
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

  find = async (custom) => {
    try {
      return await this.items.find(custom);
    } catch (error) {
      GenericDAO.handleError(error);
      return null;
    }
  };

  delete = async (item) => {
    try {
      const itemeliminado = await this.items.delete(item);
      if (itemeliminado !== null) {
        return itemeliminado;
      }
      return null;
    } catch (error) {
      GenericDAO.handleError(error);
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
      GenericDAO.handleError(error);
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
      GenericDAO.handleError(error);
      return null;
    }
  };

  save = async (p) => {
    try {
      const result = await this.items.save(p);
      if (result) {
        return result;
      }
      return null;
    } catch (error) {
      GenericDAO.handleError(error);
      return null;
    }
  };
}

module.exports = GenericDAO;
