const ProductoDTO = require('../dto/producto-dto');

const GenericDAO = require('./generic-dao');

class ProductoDAO extends GenericDAO {
  static instancia;

  constructor(datasource) {
    if (!!ProductoDAO.instancia) {
      return ProductoDAO.instancia;
    }

    super(datasource);

    this.name = 'productos';

    this.init();

    this.loadConfiguration(this);

    ProductoDAO.instancia = this;
  }

  getName() {
    return this.name;
  }

  save = async (obj) =>{
    //pre or post
    const item = await this.items.save(obj);
    if (item){
      return new ProductoDTO(item);
    }
    return false;
    
  }

  updateById = async (id,obj) =>{
    //pre or post
    const item = await this.items.updateById(id,obj);
    if (item){
      return new ProductoDTO(item);
    }
    return false;
  }

  find = async (custom) =>{
    //pre or post
    const item = await this.items.find(custom);
    if (item){
      return new ProductoDTO(item);
    }
    return false;
  }

  deleteById = async (id,obj) =>{
    //pre or post
    const item = await this.items.deleteById(id);
    if (item){
      return new ProductoDTO(item);
    }
    return false;
    
  }

  getId = async (id) =>{
    //pre or post
    const item = await this.items.getId(id);
    if (item){
      return new ProductoDTO(item);
    }
    return false;
  }

}

module.exports = ProductoDAO;
