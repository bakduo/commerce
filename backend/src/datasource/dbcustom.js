const MemoryDB = require('../util/memory-db');

class DBCustom {
  static instancia;

  constructor(config) {
    if (!!DBCustom.instancia) {
      return DBCustom.instancia;
    }

    this.store = null;

    switch (config.dbtype) {
      case 'memory':
        this.store = new MemoryDB({ type: 'memory' });
        break;
      case 'file':
        this.store = new MemoryDB({ type: 'file' });
        break;
    }

    DBCustom.instancia = this;
  }

  getStore() {
    return this.store;
  }

  static getInstance() {
    return DBCustom.instancia;
  }
}

module.exports = DBCustom;
