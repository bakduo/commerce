const Repository = require('./repository');

class ProductoRepository extends Repository {

  static instancia;

  constructor(obj) {
    if (!!ProductoRepository.instancia) {
      return ProductoRepository.instancia;
    }

    super(obj);

    ProductoRepository.instancia = this;

    
  }

  getProductosbyName = async (value)=> {
    try {

      let items = await this.getStrategy().getItems();

      return items.filter((item)=>{
        return (item.getName()==value)
      });
    } catch (error) {
      return false;
    }
  }

  getProductosbyPrice = async (value)=>{
    try {
      let items = await this.getStrategy().getItems();
      return items.filter((item)=>{
        return (item.getPrice()==value)
      });
    } catch (error) {
      return false;
    }
  }

  getProductosbyCode = async (value)=>{
    try {
      let items = await this.getStrategy().getItems();
      return items.filter((item)=>{
        return (item.getCode()==value)
      });
    } catch (error) {
      return false;
    }
  }

  getProductosbyStock = async (value)=>{
    try {
      
      let items = await this.getStrategy().getItems();

      return items.filter((item)=>{
        return (item.getStock()==value)
      });

    } catch (error) {
      
      return false;
    }
  }

}

module.exports = ProductoRepository;
