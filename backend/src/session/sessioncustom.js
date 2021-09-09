'use strict';

const WMongoStore = require('./storage/wmongo-store');

class SessionCustom {
  constructor(config) {
    this.store = null;
    this.type = config;
  }

  getStore() {
    switch (this.type.dbtype) {
      case 'mongo':
        this.store = new WMongoStore(
          this.type.host,
          this.type.port,
          this.type.url,
          this.type.secure,
          this.type.logger
        );
        break;

      default:
        break;
    }
    return this.store;
  }
}

module.exports = SessionCustom;
