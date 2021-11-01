const mongoose = require('mongoose');

const GenericDB = require('./genericdb');

class ConnectionError extends Error {
  constructor(validationErrors) {
    super();
    this.validationErrors = validationErrors;
  }
}

class CollectionError extends Error {
  constructor(collectionErrors) {
    super();
    this.collectionErrors = collectionErrors;
  }
}

class WMongo extends GenericDB {
  constructor(configDB) {
    super();    
    this.mongoClient = mongoose;
    //please remember use secret for this. or config file encrypt
    this.url = String(configDB.type.url);
    this.dbname = String(configDB.type.dbname);
    this.secure = Number(configDB.type.secure);
    this.models = configDB.type.schema;
    this.logger = configDB.type.logger;
    this.objectId = undefined;
    this.init();
  }

  setIdQuery(name){
    this.objectId = name;
  }

  init() {
    const conectarMongo = async () => {
      return await this.connect();
    };
    conectarMongo();
  }

  async connect() {
    try {
      if (Number(this.secure) === 1) {
        await this.mongoClient.connect(this.url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          ssl: true,
        });
      } else {
        await this.mongoClient.connect(this.url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          ssl: false,
        });
      }

      this.mongoClient.connection.on('open', () => {
        // Wait for mongodb connection before server starts
        this.logger.info('Connected mongo started');
      });

      // const db = this.mongoClient.connection;
      // db.db.command({ connPoolStats: 1 }, function (err, result) {
      //   console.log(result, err);
      // });
    } catch (error) {
      this.logger.error(this.url);
      this.logger.error(`Error Conection ${error.message}`);
      throw new ConnectionError(error.message);
    }
  }

  async createCollection(name) {
    try {
      const db = this.mongoClient.connection.db.db(this.dbname);
      await db.createCollection(name);
    } catch (error) {
      this.logger.error(`Error Collection ${error.message}`);
      throw new CollectionError(error.message);
    }
  }

  setTable(t) {
    this.setCollection(t);
  }

  setCollection(name) {
    this.collection = name;
  }

  getCollection() {
    return this.collection;
  }

  setModel(m) {
    this.model = m;
  }

  getModel() {
    return this.model;
  }

  generateModel(name, schema) {
    return this.mongoClient.model(name, schema);
  }

  deleteAll = async () => {
    try {

      const items = await this.getItems();
      
      if (items.length>0){
        return this.model.collection.drop();
      }
      return false;

    } catch (error) {
      console.log(error);
      this.logger.debug("Exception al realiar drop de collection");
      throw new Error(`Error al realizar drop de collection ${error}`);
    }
    
  };

  getItems = async () => {
    return await this.model.find();
  };

  isValidId(id){
   
    if (typeof id !== 'string') {
      return false;
    }
    return id.match(/^[a-f\d]{24}$/i);

  }

  getId = async (id) => {
    
    if (!this.isValidId(id)) return false;

    const item = await this.model.findOne({ _id: id  });

    if (item){
      let newItem = item;
      newItem[this.objectId] = id;
      return newItem;
    }
    return false;
  };
  
  getItemsOther = async (id,modelname) => {

    const items = await this.model.findOne({_id:id}).populate(modelname);
    
    if (items){
      return items;
    }
  
    return false;
  };

  deleteById = async (id) => {
    try {

      if (!this.isValidId(id)) return false;

      const item = await this.getId(id);
      if (item){
        const deleteItem = await this.model.deleteOne({
          _id: id,
        });

        if (deleteItem){
          let newItem = item;
          newItem[this.objectId]=item._id;
          return newItem;
        }
      }
      return false;
    } catch (error) {
      this.logger.error(`Error no fue posible eliminar objeto: ${error}`);
      return false;
    }
  };

  delete = async (item) => {

    try {
      const deleteItem = await this.model.deleteOne({
        _id: item._id,
      });
  
      if (deleteItem){
        let newItem = item;
        newItem[this.objectId] = item._id;
        return newItem
      }  
      return false;
    } catch (error) {
      this.logger.error(`Error no fue posible eliminar objeto: ${error}`);
      return false;
    }
  
  };

  find = async (custom) => {
    const query = {};
    try {
      query[custom.query.key] = custom.query.value;
      
      const resultado = await this.model.find(query);
      if (resultado.length>0){
        let newItem = resultado[0];
        newItem[this.objectId] = resultado[0]._id;
        return newItem;
      }
      return false;
    } catch (error) {
      this.logger.error(`Exception al buscar custom ${error.message}`);
      return false;
    }
  };

  includeById = async (item) => {
    const includeItem =  await this.model.find({
      _id: item._id,
    });
    if (includeItem){
      let newItem = item;
      newItem[this.objectId] = item._id;
      return newItem;
    }
    return false;
  };

  updateById = async (idx, item) => {

    if (!this.isValidId(idx)) return false;

    const result = await this.model.updateOne({ _id: idx }, item);

    if (result.ok === 1 && result.nModified === 1) {
      let newItem = item;
      newItem[this.objectId] = idx;
      
      return newItem;
    }
    return false;
  };

  convertJson(obj){
    let nuevoSTR = JSON.stringify(obj);
    let nuevoOBJ = JSON.parse(nuevoSTR);
    nuevoOBJ[this.objectId] = obj._id;
    return obj;
  }

  save = async (p) => {
    
    const item = new this.model(p);
    let newItem = await item.save(p);
    //newItem[this.objectId] = newItem._id;
    return this.convertJson(newItem);
  };

  loadConfiguration = async (...args) => {
    this.setTable(args[0]);
    try {
      this.setIdQuery('id');
      const nameModule = require('../../model/' + this.models[`${args[0]}`]);
      this.setModel(await this.generateModel(args[0], nameModule));
    } catch (error) {
      throw new Error(`Error al realizar set de modelo para ${args[0]}`);
    }
  };
}

module.exports = WMongo;