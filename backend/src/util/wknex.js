const CommonDAO = require('./commondao');

class WKnex extends CommonDAO {
  constructor(method) {
    try {
      super();
      this.dbname = '';
      this.table = '';
      this.query = '';
      this.options = {};

      switch (method.type) {
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
              host: process.env.DBMYSQL_HOST,
              user: process.env.DBMYSQL_USER,
              password: process.env.DBMYSQL_PASSWD,
              database: process.env.DBMYSQL_DBNAME,
              port: process.env.DBMYSQL_PORT,
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
      return await this.knex.from(this.table).select('*').where('id', '=', idx);
    };

    const resultado = await query(id);

    return resultado[0];
  };

  deleteById = async (id) => {
    const query = async (idx) => {
      return await this.knex(this.table).where({ id: idx }).del();
    };

    const resultado = await query(id);

    return resultado;
  };

  updateById = async (id, producto) => {
    const query = async (idx) => {
      return await this.knex(this.table).where({ id: idx }).update(producto);
    };

    const resultado = await query(id);

    return resultado;
  };

  getSize = () => {
    console.log('implement concrete class');
  };

  save = async (p) => {
    const query = async (item) => {
      return await this.knex(this.table).insert(item);
    };

    const resultado = await query(p);
  };

  searchItem(value, expression_equal) {}
}

module.exports = WKnex;
