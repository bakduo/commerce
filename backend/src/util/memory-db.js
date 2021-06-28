const ArchivoRepository = require('../repository/archivo-repository');

const path = require('path');

class MemoryDB {
  //caso ejemplo una DB memory

  constructor(method) {
    try {
      this.complement = null;
      this.persistence = false;
      if (method.type === 'file') {
        this.persistence = true;
      }

      // if (method.type === 'file') {
      //   this.complement = new ArchivoRepository(
      //     path.resolve('./', process.env.DBPATH)
      //   );
      // }

      this.items = [];
      this.cb = {};
    } catch (error) {
      throw Error(error);
    }
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

  getIndex = (id) => {
    const index = this.items.findIndex((item) => this.cb(item, id));

    if (index >= 0) {
      return index;
    }

    return -1;
  };

  getItems = () => {
    return this.items;
  };

  getId = (id) => {
    try {
      const index = this.getIndex(id);
      if (index >= 0) {
        return this.items[index];
      }
      return null;
    } catch (error) {
      throw error;
    }
  };

  deleteById = (id) => {
    try {
      const itemDelete = this.getId(id);

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
