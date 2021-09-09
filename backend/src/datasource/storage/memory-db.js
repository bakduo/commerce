const ArchivoRepository = require('./archivo-repository');

const path = require('path');

const GenericDB = require('./genericdb');

class MemoryDB extends GenericDB {
  constructor(method) {
    try {
      super();

      this.complement = null;
      this.persistence = false;
      if (method.type === 'file') {
        this.persistence = true;
      }

      this.items = [];
      this.cb = {};
    } catch (error) {
      throw Error(error);
    }
  }

  getType() {
    return 'memory';
  }

  replaceAll(data) {
    this.items = data;
  }

  getPersistence() {
    return this.persistence;
  }

  setPersistence(pathLocal) {
    if (this.persistence) {
      this.complement = new ArchivoRepository(path.resolve('./', pathLocal));
    }
  }

  setMathItem(match) {
    this.cb = match;
  }

  async reloadFromFile() {
    if (this.complement !== null) {
      this.items = await this.complement.readFile();
    }
  }

  clear = async () => {
    this.items = [];
    if (this.complement !== null) {
      await this.complement.deleteFile();
    }
  };

  getIndex = async (id) => {
    const index = this.items.findIndex((item) => this.cb(item, id));

    if (index >= 0) {
      return index;
    }

    return -1;
  };

  getItems = async () => {
    return this.items;
  };

  getId = async (id) => {
    try {
      const index = await this.getIndex(id);
      if (index >= 0) {
        return this.items[index];
      }
      return null;
    } catch (error) {
      throw error;
    }
  };

  deleteById = async (id) => {
    try {
      const itemDelete = await this.getId(id);

      if (itemDelete !== null) {
        this.items = this.items.filter((item) => item !== itemDelete);
        return itemDelete;
      }

      return null;
    } catch (error) {
      throw error;
    }
  };

  updateById = (id, producto) => {
    try {
      const index = this.getIndex(id);
      if (index >= 0) {
        //TODO FIX
        this.items[index].update(producto);
        return this.items[index];
      }
      return null;
    } catch (error) {
      throw error;
    }
  };

  getSize = () => {
    return this.items.length;
  };

  sync = async () => {
    if (this.complement !== null) {
      await this.complement.save(this.items);
    }
  };

  save = async (p) => {
    try {
      this.items.push(p);
      if (this.complement !== null) {
        await this.complement.save(this.items);
      }
      return p;
    } catch (error) {
      throw error;
    }
  };

  //expresion_equal=(item,valor)=>{return (item.a===valor)};
  searchItem(value, expression_equal) {
    return this.items.find((item) => expression_equal(item, value));
  }
}

module.exports = MemoryDB;
