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
  constructor(...args) {
    super();
    this.mongoClient = mongoose;
    //please remember use secret for this. or config file encrypt
    this.url = String(args[0]);
    this.dbname = String(args[1]);
    this.secure = Number(args[2]);
    this.models = args[3];
    this.logger = args[4];
    this.init();
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
    return this.model.collection.drop();
  };

  getItems = async () => {
    return await this.model.find();
  };

  getId = async (id) => {
    return await this.model.findOne({ _id: id });
  };

  deleteById = async (id) => {
    return await this.model.deleteOne({
      _id: id,
    });
  };

  delete = async (item) => {
    return await this.model.deleteOne({
      _id: item._id,
    });
  };

  find = async (custom) => {
    const query = {};

    query[custom.query.key] = custom.query.value;

    return await this.model.find(query);
  };

  includeById = async (item) => {
    return await this.model.find({
      _id: item._id,
    });
  };

  updateById = async (idx, item) => {
    const result = await this.model.updateOne({ _id: idx }, item);

    if (result.ok === 1 && result.nModified === 1) {
      return result;
    }
    return null;
  };

  save = async (p) => {
    const item = new this.model(p);
    return await item.save(p);
  };

  loadConfiguration = async (...args) => {
    this.setTable(args[0]);
    try {
      const nameModule = require('../../model/' + this.models[`${args[0]}`]);
      this.setModel(await this.generateModel(args[0], nameModule));
    } catch (error) {
      throw new Error(`Error al realizar set de modelo para ${args[0]}`);
    }
  };
}

module.exports = WMongo;
