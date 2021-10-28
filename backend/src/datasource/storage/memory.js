// const ArchivoRepository = require('./archivo-repository');

// const path = require('path');

// const GenericDB = require('./genericdb');

// class MemoryDB extends GenericDB {
//   constructor(method) {
//     try {
//       super();

//       this.complement = null;
//       this.persistence = false;
//       if (method.type === 'file') {
//         this.persistence = true;
//       }

//       this.items = [];
//       this.cb = {};
//     } catch (error) {
//       throw Error(error);
//     }
//   }

//   getType() {
//     return 'memory';
//   }

//   replaceAll(data) {
//     this.items = data;
//   }

//   getPersistence() {
//     return this.persistence;
//   }

//   setPersistence(pathLocal) {
//     if (this.persistence) {
//       this.complement = new ArchivoRepository(path.resolve('./', pathLocal));
//     }
//   }

//   setMathItem(match) {
//     this.cb = match;
//   }

//   async reloadFromFile() {
//     if (this.complement !== null) {
//       this.items = await this.complement.readFile();
//     }
//   }

//   clear = async () => {
//     this.items = [];
//     if (this.complement !== null) {
//       await this.complement.deleteFile();
//     }
//   };

//   getIndex = async (id) => {
//     const index = this.items.findIndex((item) => this.cb(item, id));

//     if (index >= 0) {
//       return index;
//     }

//     return -1;
//   };

//   getItems = async () => {
//     return this.items;
//   };

//   getId = async (id) => {
//     try {
//       const index = await this.getIndex(id);
//       if (index >= 0) {
//         return this.items[index];
//       }
//       return null;
//     } catch (error) {
//       throw error;
//     }
//   };

//   deleteById = async (id) => {
//     try {
//       const itemDelete = await this.getId(id);

//       if (itemDelete !== null) {
//         this.items = this.items.filter((item) => item !== itemDelete);
//         return itemDelete;
//       }

//       return null;
//     } catch (error) {
//       throw error;
//     }
//   };

//   updateById = (id, producto) => {
//     try {
//       const index = this.getIndex(id);
//       if (index >= 0) {
//         //TODO FIX
//         this.items[index].update(producto);
//         return this.items[index];
//       }
//       return null;
//     } catch (error) {
//       throw error;
//     }
//   };

//   getSize = () => {
//     return this.items.length;
//   };

//   sync = async () => {
//     if (this.complement !== null) {
//       await this.complement.save(this.items);
//     }
//   };

//   save = async (p) => {
//     try {
//       this.items.push(p);
//       if (this.complement !== null) {
//         await this.complement.save(this.items);
//       }
//       return p;
//     } catch (error) {
//       throw error;
//     }
//   };

//   //expresion_equal=(item,valor)=>{return (item.a===valor)};
//   searchItem(value, expression_equal) {
//     return this.items.find((item) => expression_equal(item, value));
//   }
// }

// module.exports = MemoryDB;

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
    this.items = {};
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
        item[this.objectId] = this.items[this.table][index][this.objectId];
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

  save = async (p) => {
    try {
      //Random id
      p[this.objectId] = crypto.randomBytes(21).toString("hex");
      this.items[this.table].push(p);
      this.logger.info(p);
      return p;
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