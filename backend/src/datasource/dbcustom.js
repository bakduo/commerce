const MemoryDB = require('../util/memory-db');
const WKnex = require('../util/wknex');

class DBCustom {
  constructor(config) {
    this.store = null;
    this.type = config;
  }

  getStore() {
    switch (this.type.dbtype) {
      case 'memory':
        this.store = new MemoryDB({ type: 'memory' });
        break;
      case 'file':
        this.store = new MemoryDB({ type: 'file' });
        break;
      case 'knex':
        this.store = new WKnex({
          type: this.type.persistence,
        });
        break;

      default:
        break;
    }
    return this.store;
  }

  static getInstanceDB(typeDB) {
    return new MemoryDB({ type: typeDB });
  }
}

module.exports = DBCustom;
