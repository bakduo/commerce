const mongoose = require('mongoose');

const CommonDAO = require('./commondao');

class WMongo extends CommonDAO {
  constructor(method) {
    super();
    this.mongoClient = mongoose;
    this.url = `mongodb://${process.env.DBTYPE_PRINCIPAL_USER}:${process.env.DBTYPE_PRINCIPAL_PASSWD}@${process.env.DBTYPE_PRINCIPAL_HOST}:${process.env.DBTYPE_PRINCIPAL_PORT}/${process.env.DBTYPE_PRINCIPAL_DBNAME}`;
    this.dbname = `${process.env.DBTYPE_PRINCIPAL_DBNAME}`;
    this.collection = '';
    this.model = {};
    this.query = '';
    this.init();
  }

  init() {
    const conectarMongo = async () => {
      return await this.connect();
    };
    conectarMongo();
  }

  getType() {
    return 'nosql';
  }

  async connect() {
    try {
      await this.mongoClient.connect(this.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
      });

      this.mongoClient.connection.on('open', () => {
        // Wait for mongodb connection before server starts
        console.log('Connected mongo started');
      });

      // const db = this.mongoClient.connection;
      // db.db.command({ connPoolStats: 1 }, function (err, result) {
      //   console.log(result, err);
      // });
    } catch (error) {
      throw Error(error);
    }
  }

  async createCollection(name) {
    try {
      const db = this.mongoClient.connection.db.db(this.dbname);
      await db.createCollection(name);
    } catch (error) {
      throw Error(error);
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

  replaceAll = async (data) => {
    console.log('implement concrete class');
  };

  setMathItem = async (match) => {
    console.log('implement concrete class');
  };

  clear = async () => {
    console.log('implement concrete class');
  };

  getIndex = async (id) => {
    console.log('implement concrete class');
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

  getSize = async () => {
    console.log('implement concrete class');
  };

  save = async (p) => {
    const item = new this.model(p);
    return await item.save(p);
  };

  loadConfiguration = async (...args) => {
    this.setTable(args[0]);
    this.setModel(await this.generateModel(args[1], args[2]));
  };

  searchItem = async (value, expression_equal) => {
    console.log('implement concrete class');
  };
}

module.exports = WMongo;
