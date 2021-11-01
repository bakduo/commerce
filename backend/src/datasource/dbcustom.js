
class DBCustom {
  constructor(configDB) {
    this.store = null;
    this.type = configDB;
  }

  getType(){
    return this.type.dbtype;
  }

  getStore() {
    try {
      const nameModule = this.type.persistence[this.type.dbtype];
      const moduleStore = require(`./storage/${nameModule}`);
      this.store = new moduleStore(this);
      return this.store;
    } catch (error) {
      throw new Error(`Error al realizar set de modelo para ${error}`);
    }
  }
}

module.exports = DBCustom;