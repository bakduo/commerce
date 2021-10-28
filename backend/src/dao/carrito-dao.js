const CarritoDTO = require('../dto/carrito-dto');
const GenericDAO = require('./generic-dao');

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

  save = async (obj) =>{
    //pre or post
    const item = await this.items.save(obj);
    if (item){
      return new CarritoDTO(item);
    }
    return false;
    
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
