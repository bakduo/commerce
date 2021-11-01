const GenericDAO = require('./generic-dao');
const config = require('../config/index');
const OrdenDTO = require('../dto/orden-dto');
const logger = config.logger;
const ProductoDTO = require('../dto/producto-dto');

class OrdenDAO extends GenericDAO {
  static instancia;

  constructor(datasource) {
    if (!!OrdenDAO.instancia) {
      return OrdenDAO.instancia;
    }

    super(datasource);

    this.init();

    this.name = 'ordenes';

    this.loadConfiguration(this);

    OrdenDAO.instancia = this;
  }

  getName() {
    return this.name;
  }

  getItemsOfCompra = async (id,modelname)=>{

    let itemsFull = await this.items.getItemsOther(id,modelname);

    if (itemsFull){
      
      if (itemsFull.productos.length > 0){

        return itemsFull.productos.map((item) => {
              const itemNew = new ProductoDTO(item);
              return itemNew;
        });
      }
    }
    
  
    return [];

  }

  getItems = async () => {

    let nuevos = [];

    let temporal = await this.items.getItems();

    temporal.forEach((item) => {
      nuevos.push(new OrdenDTO(item))
    });

    return nuevos;
    
  }

  save = async (obj) =>{
    //pre or post
    const item = await this.items.save(obj);
    
    try {
      if (item){
        return new OrdenDTO(item);
      }
      return false;
    } catch (error) {
      logger.debug("Error al realizar save");
      return false;
    }
  }

  updateById = async (id,obj) =>{
    //pre or post
    const item = await this.items.updateById(id,obj);
    if (item){
      return new OrdenDTO(item);
    }
    return false;
    
  }

  deleteById = async (id) =>{
    //pre or post
    const item = await this.items.deleteById(id);
    if (item){
      return new OrdenDTO(item);
    }
    return false;
  }

  getId = async (id) =>{
    //pre or post
    const item = await this.items.getId(id);
    if (item){
      return new OrdenDTO(item);
    }
    return false;
  }

  find = async (custom) =>{
    //pre or post
    const item = await this.items.find(custom);
    if (item){
      return new OrdenDTO(item);
    }
    return false;
  }
}

module.exports = OrdenDAO;
