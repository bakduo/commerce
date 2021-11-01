const GenericDAO = require('./generic-dao');
const config = require('../config/index');
const logger = config.logger;
const CarritoDTO = require('../dto/carrito-dto');


class CarritoDAO extends GenericDAO {
  static instancia;

  constructor(datasource) {
    if (!!CarritoDAO.instancia) {
      return CarritoDAO.instancia;
    }

    super(datasource);

    this.init();

    this.name = 'carritos';

    this.loadConfiguration(this);

    CarritoDAO.instancia = this;
  }

  getName() {
    return this.name;
  }

  getItems = async () => {

    let nuevos = [];

    let temporal = await this.items.getItems();

    temporal.forEach((item) => {
      nuevos.push(new CarritoDTO(item))
    });

    return nuevos;
  }

  save = async (obj) =>{
    
    const item = await this.items.save(obj);
    
    try {
      if (item){
         return new CarritoDTO(item);
      }
      return false;
    } catch (error) {
      logger.debug("Error al realizar save");
      console.log(error.message);
      return false;
    }
  }

  updateById = async (id,obj) =>{
    //pre or post
    const item = await this.items.updateById(id,obj);
    if (item){
      return new CarritoDTO(item);
    }
    return false;
    
  }

  deleteById = async (id) =>{
    //pre or post
    const item = await this.items.deleteById(id);
    if (item){
      return new CarritoDTO(item);
    }
    return false;
  }


  getId = async (id) =>{
    //pre or post
    const item = await this.items.getId(id);
    if (item){
      return new CarritoDTO(item);
    }
    return false;
  }

  find = async (custom) =>{
    //pre or post
    const item = await this.items.find(custom);
    if (item){
      return new CarritoDTO(item);
    }
    return false;
  }
}

module.exports = CarritoDAO;
