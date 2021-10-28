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

    return false;
  };

  getItems = async () => {
    const items = await this.items.getItems();

    if (items) {
      return items;
    }

    return false;
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
      return false;
    }
  };

  delete = async (item) => {
    try {
      const itemeliminado = await this.items.delete(item);
      if (itemeliminado !== null) {
        return itemeliminado;
      }
      return false;
    } catch (error) {
      GenericDAO.handleError(error);
      return false;
    }
  };

  deleteById = async (id) => {
    try {
      const item = await this.items.deleteById(id);
      if (item !== null) {
        return item;
      }
      return false;
    } catch (error) {
      GenericDAO.handleError(error);
      return false;
    }
  };

  updateById = async (id, producto) => {
    try {
      const p = await this.items.updateById(id, producto);
      if (p) {
        return p;
      }
      return false;
    } catch (error) {
      GenericDAO.handleError(error);
      return false;
    }
  };

  save = async (p) => {
    try {
      const result = await this.items.save(p);
      if (result) {
        return result;
      }
      return false;
    } catch (error) {
      GenericDAO.handleError(error);
      return false;
    }
  };
}

module.exports = GenericDAO;
