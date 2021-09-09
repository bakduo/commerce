const MemoryDB = require('./storage/memory-db');
const WKnex = require('./storage/wknex');
const WMongo = require('./storage/wmongo');

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
        this.store = new WMongo(
          this.type.url,
          this.type.dbname,
          this.type.secure,
          this.type.schema,
          this.type.logger
        );
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
