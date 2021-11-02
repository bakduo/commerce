const GenericDB = require('./genericdb');

class WKnex extends GenericDB {
  constructor(configDB) {
    try {

      super();
      this.dbname = '';
      this.table = '';
      this.query = '';
      this.options = {};
      this.idQuery = '';
      this.trx = null;
      this.trxProvider = null;
      this.transactionProvider = null;
      this.logger = configDB.type.logger;
      this.objectId = undefined;

 

      switch (configDB.type.dbtype) {
        case 'sqlite':
          this.options = {
            client: 'sqlite3',
            connection: { filename: 'db/db.sqlite' },
            useNullAsDefault: true,
          };

          break;
        case 'mysql':
          this.options = {
            client: 'mysql',
            connection: {
              host: process.env.DBTYPE_PRINCIPAL_HOST,
              user: process.env.DBTYPE_PRINCIPAL_USER,
              password: process.env.DBTYPE_PRINCIPAL_PASSWD,
              database: process.env.DBTYPE_PRINCIPAL_DBNAME,
              port: process.env.DBTYPE_PRINCIPAL_PORT,
            },
          };
          break;
        default:
          break;
      }

      this.knex = require('knex')(this.options);
    } catch (error) {
      throw Error(error);
    }
  }

  getModel() {
    throw new Error("No implementado");
  }

  getType() {
    return 'sql';
  }

  setQuery(q) {
    this.query = q;
  }

  setTable(t) {
    this.table = t;
  }

  replaceAll(data) {
    console.log('implement concrete class');
  }

  setMathItem(match) {
    console.log('implement concrete class');
  }

  clear = async () => {
    console.log('implement concrete class');
  };

  getIndex = async (id) => {
    const query = async (idx) => {
      return await this.knex.from(this.table).select('*').where('id', '=', idx);
    };

    const resultado = await query(id);

    return resultado;
  };

  getItems = async () => {
    const query = async (idx) => {
      return await this.knex.from(this.table).select('*');
    };

    const resultado = await query();

    return resultado;
  };

  getId = async (id) => {
    const query = async (idx) => {
      return await this.knex
        .from(this.table)
        .select('*')
        .where(this.idQuery, '=', idx);
    };

    const resultado = await query(id);

    return resultado[0];
  };

  setIdQuery(idname) {
    this.idQuery = idname;
  }

  deleteById = async (id) => {

    const item = await this.getId(id);
    if (item){
      const query = async (idx) => {
        if (this.trx) {
          return await this.trx(this.table).where(this.idQuery, idx).del();
        }
        return await this.knex(this.table).where(this.idQuery, idx).del();
      };
      
      await query(id);
      return item;
    }
    return false;
  };

  
  deleteAll = async()=>{
    const items = await this.getItems();
    items.forEach(async (item) => {
      const ok = await this.deleteById(item.id);
      if (!ok){
        throw new Error(error);
      }
    });
    return true;
  }
  

  delete = async (item) => {
    const query = async (idx) => {
      if (this.trx) {
        return await this.trx(this.table).where(this.idQuery, item.id).del();
      }
      return await this.knex(this.table).where(this.idQuery, item.id).del();
    };

    const resultado = await query(item.id);

    return resultado;
  };

  updateById = async (id, item) => {
    const query = async (idx) => {
      if (this.trx) {
        return await this.trx(this.table).where(this.idQuery, idx).update(item);
      }

      return await this.knex(this.table).where(this.idQuery, idx).update(item);
    };

    const resultado = await query(id);

    return resultado;
  };

  getSize = () => {
    console.log('implement concrete class');
  };

  save = async (p) => {
    const query = async (item) => {
      if (this.trx) {
        return await this.trx(this.table).insert(item);
      }
      return await this.knex(this.table).insert(item);
    };

    const resultado = await query(p);

    return resultado[0];
  };

  transaction = async () => {
    try {
      this.trxProvider = this.knex.transactionProvider();
      this.trx = await this.trxProvider();
      return this.trx;
    } catch (error) {
      throw Error(error);
    }
  };

  getTransactionGenerated() {
    return this.trxProvider;
  }

  setTransactionGenerated(t) {
    this.trxProvider = t;
  }

  getTransactionProvider() {
    return this.transactionProvider;
  }

  setTransactionProvider(t) {
    this.transactionProvider = t;
  }

  isCompletedTransaction() {
    return this.trx.isCompleted();
  }

  setTrx(t) {
    this.trx = t;
  }

  commit() {
    try {
      this.trx.commit();
    } catch (error) {
      throw Error(error);
    }
  }

  rollback() {
    try {
      this.trx.rollback();
    } catch (error) {
      throw Error(error);
    }
  }

  reuseTransaction = async () => {
    try {
      this.trx = await this.trxProvider();
      return this.trx;
    } catch (error) {
      throw Error(error);
    }
  };

  find = async (custom) => {
    const query = async (query_value, idx) => {
      return await this.knex
        .from(this.table)
        .select('*')
        .where(query_value, '=', idx);
    };

    const resultado = await query(custom.query.key, custom.query.value);

    return resultado[0];
  };
  searchItem(value, expression_equal) {}

  init() {}

  loadConfiguration = async (...args) => {
    this.setTable(args[0]);
    this.setIdQuery('id');
  };
}

module.exports = WKnex;