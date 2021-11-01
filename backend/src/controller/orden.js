// Controller routes
const config = require('../config/index');
const logger = config.logger;
const OrdenApi = require('../api/orden-api');

class OrdenController {

  constructor(repository, repositoryProductos,repoCarrito){

    this.api = new OrdenApi(repository,repositoryProductos,repoCarrito);

  };

  getOrdenesUser = async (req, res, next) => {
    try {
      if (req.params.email) {
      
        let ordenes = await this.api.getAllOrderByUser(req.params.email);

        if (ordenes){
            
          ordenes = ordenes.map((item)=>{
              return item.toJson();
          });

          return res.status(200).json({
            status:true,
            ordenes:ordenes,
            fail: false
          });

        }
      }
      return res.status(404).json({
        status:'Orden no encontrada.',
        fail: false
      });
    } catch (error) {
      return res.status(500).json({ status: `${error}` });
    }
  };

  getProductosOrden = async (req, res, next) => {
    try {

      if (req.params.id){

        const productos = await this.api.getProductos(req.params.id);

        if (productos.length > 0){
          let productosUser = productos.map((item)=>{
            return item.toJson();
          });
          return res.status(200).json(productosUser);
        }
      };

      return res.status(404).json({
        status:'Orden con productos no encontrado.',
        fail: false
      });

    } catch (error) {
      
      logger.debug(`Exception getProductosOrden OrdenController: ${error}`);

      return res.status(500).json({
        status:'Ocurrio un problema en la optención de productos de la orden solicitada.',
        fail: false
      });

    }
  };

  getOrdenes = async (req, res, next) => {
    try {

      let ordenes = await this.api.getAll();

      ordenes = ordenes.map((item)=>{
        return item.toJson();
      });

      return res.status(200).json(ordenes);

    } catch (error) {
      return res.status(500).json({
            status:false,
            fail: 'No fue posible retornar la lista de ordenes.'
          });
    }
  };

  getOrden = async (req, res, next) => {
    try {
      if (req.params.id) {
      
        const orden = await this.api.getOne(req.params.id);

        if (orden){
            return res.status(200).json(orden.toJson());
        }
      }
      return res.status(404).json({
        status:'Orden no encontrada.',
        fail: false
      });
    } catch (error) {
      return res.status(500).json({ status: `${error}` });
    }
  };

  deleteOrden = async (req, res, next) => {
    try {
      if (req.params.id) {
        
        const orden = await this.api.getOne(req.params.id);
        if (orden) {
          const eliminado = await this.api.deleteOne(req.params.id);
          if (eliminado) {
            return res.status(200).json(eliminado.toJson());
          }else{
            return res.status(500).json({
              status:false,
              fail: 'No fue posible eliminar la orden.'
            });
          }
        }
      }
      return res.status(404).json({
        status:'Orden no ncontrada',
        fail: false
      });
    } catch (error) {
      return res.status(500).json({ status: `${error}` });
    }
  };

  makeAndOrder = async (req, res, next) => {
    
    try {
      
        const orden = await this.api.generateOrder(req.user);
        
        if (orden){
          return res.status(200).json({
            status: true,
            orden: orden.toJson(),
            fail: false
          });
        }

        return res.status(500).json({
          status:false,
          fail:'No fue posible generar la Orden.'
        });

    } catch (error) {

      logger.debug(`Exception generada en MakeAndOrder: ${error}`);

      return res.status(500).json({
             status: false,
             fail: 'Ocurrio un error en el sistema. No fue posible procesar su pedido.',
      });
    }

  };
}

module.exports = OrdenController;
