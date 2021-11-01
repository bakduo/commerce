const GenericDB = require('./genericdb');
const crypto = require("crypto");
class MemoryDB extends GenericDB {

  constructor(configDB) {
    try {
      super();
      this.complement = null;
      this.items = {};
      this.table = "";
      this.objectId =undefined;
      this.logger = configDB.type.logger;
    } catch (error) {
      throw Error(error);
    }
  }

  setTable(name){
    this.table = name;
  }

  loadConfiguration = async (...args) => {
    this.setTable(args[0]);
    this.setIdQuery('id');
    this.items[this.table]=[];
  };

  setIdQuery(name){
    this.objectId = name;
  }

  getType() {
    return 'memory';
  }

  replaceAll(data) {
    this.items[this.table] = data;
  }

  clear = async () => {
    this.items[this.table]=[];
  };

  getIndex = async (id) => {

    const items = this.items[this.table];
    const index = items.findIndex((item) => {return(item[this.objectId]===id)});
    if (index >= 0) {
      return index;
    }
    return -1;
  };

  getItems = async () => {
    return this.items[this.table];
  };

  getItemsOther = async (id,modelname) => {

    const index = await this.getIndex(id);

    if (index>=0){
        return this.items[this.table][index];
    }

    return false;
  };

  getId = async (id) => {
    try {
      const index = await this.getIndex(id);
      
      if (index >= 0) {
        
        return this.items[this.table][index];
      }
      return null;
    } catch (error) {
      this.logger.error(`Error objeto no se puede obtener ${error}`);
      throw new Error(`Error objeto no se puede obtener ${error}`);
    }
  };

  deleteAll = async () => {
    await this.clear();
    return true;
  }

  deleteById = async (id) => {
    try {
      const itemDelete = await this.getId(id);
      this.logger.info(itemDelete);
      if (itemDelete !== null) {
        this.items[this.table] = this.items[this.table].filter((item) => item[this.objectId] !== id);
        return itemDelete;
      }
      return null;
    } catch (error) {
      this.logger.error(`Error objeto no eliminado ${error}`);
      throw new Error(`Error objeto no eliminado ${error}`);
    }
  };

  updateById = async (id, item) => {
    try {
      
      const index = await this.getIndex(id);
      
      
      if (index >= 0) {
        //TODO FIX
        item[this.objectId] = id;

        this.items[this.table][index] = item;
        return this.items[this.table][index];
      }
      return null;
    } catch (error) {
      this.logger.error(`Error objeto no actualizado ${error}`);
      throw new Error(`Error objeto no actualizado ${error}`);
    }
  };

  getModel() {
    throw new Error("No implementado");
  }

  getSize = () => {
    return this.items[this.table].length;
  };

  //https://www.w3docs.com/snippets/javascript/how-to-clone-a-javascript-object.html

  copyObj = (mainObject) => {
    let objectCopy = {}; // objectCopy will store a copy of the mainObject
    let key;
    for (key in mainObject) {
      objectCopy[key] = mainObject[key]; // copies each property to the objectCopy object
    }
    return objectCopy;
  }

  save = async (p) => {
    try {
      //Random id
      let nuevo = this.copyObj(p);
      nuevo[this.objectId] = crypto.randomBytes(21).toString("hex");
      this.items[this.table].push(nuevo);
      this.logger.info(nuevo);
      return nuevo;
    } catch (error) {
      this.logger.error(`Error objeto no guardado ${error}`);
      throw new Error(`Error objeto no guardado ${error}`);
    }
  };

  //expresion_equal=(item,valor)=>{return (item.a===valor)};
  searchItem(value, expression_equal) {
    return this.items[this.table].find((item) => expression_equal(item, value));
  }

  find = async (custom) => {
    try {
      const resultado = await this.items[this.table].find((item)=>{
        return (item[custom.query.key]===custom.query.value)
      });
      this.logger.info(resultado);
      return resultado;
    } catch (error) {
      this.logger.error(`Error objeto no encontrado ${error}`);
      throw new Error(`Error objeto no encontrado ${error}`);
    }
  };
}

module.exports = MemoryDB;