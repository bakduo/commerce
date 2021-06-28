const MemoryDB = require('../util/memory-db');

class DBCustom {
  //static instancia;

  constructor(config) {
    // if (!!DBCustom.instancia) {
    //   return DBCustom.instancia;
    // }

    this.store = null;
    this.type = config.dbtype;
    //DBCustom.instancia = this;
  }

  getStore() {
    switch (this.type) {
      case 'memory':
        this.store = new MemoryDB({ type: 'memory' });
        break;
      case 'file':
        this.store = new MemoryDB({ type: 'file' });
        break;
    }
    return this.store;
  }

  getInstanceDB(typeDB) {
    return new MemoryDB({ type: typeDB });
  }

  // static getInstance() {
  //   return DBCustom.instancia;
  // }
}

module.exports = DBCustom;
