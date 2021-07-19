const MemoryDB = require('../util/memory-db');
const WKnex = require('../util/wknex');
const WMongo = require('../util/wmongo');

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
      case 'mysql':
        this.store = new WKnex({
          type: 'mysql',
        });
        break;
      case 'sqlite':
        this.store = new WKnex({
          type: 'sqlite',
        });
        break;
      case 'mongo':
        this.store = new WMongo({
          type: 'nosql',
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
