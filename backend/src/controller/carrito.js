// Controller routes

const IncludeProductos = require('../util/busquedas/include-productos');
const config = require('../config/index');
const logger = config.logger;
const CarritosApi = require('../api/carrito-api');

/**
 * [CarritoController no me gusta este controller pero es lo que piden [carrito1....carriton(producto)]]
 * Desde mi punto de vista deberia ser carrito : { [p1...pn]}.
 */
class CarritoController {

  constructor(repository, repositoryProductos,repoorden){
     this.api = new CarritosApi(repository,repositoryProductos,repoorden);
  };

  /**
   * [async description]
   *
   * @param   {[type]}  req   [req ]
   * @param   {[type]}  res   [res collection de productos carrito]
   * @param   {[type]}  next  [next description]
   *
   * @return  {[type]}        [return retora la collection de  carritos]
   */
  getProductos = async (req, res, next) => {
    try {
      const user = req.user;

      let productos = await this.api.getAll();
      
      productos = productos.filter((item) => item.getCarritoSession() == user.id);

      if (productos === null){
        return res.status(400).json({ status: 'No hay productos cargados' });
      }

      if (productos.length>0){
        productos = productos.map((item)=>{return item.toJson()});
      }
      
      return res.status(200).json(productos);

    } catch (error) {
      return res.status(500).json({ status: `${error}` });
    }
  };

  /**
   * [async description]
   *
   * @param   {[type]}  req   [req id de carrito]
   * @param   {[type]}  res   [res un carrito]
   * @param   {[type]}  next  [next description]
   *
   * @return  {[type]}        [return un carrito]
   */
  getProducto = async (req, res, next) => {
    try {
      if (req.params.id) {
        
        //const producto = await this.repo.getId(req.params.id);
        const producto = await this.api.getOne(req.params.id);
        const user = req.user;
        if (producto){
          if (producto.getCarritoSession() == user.id) {
            return res.status(200).json(producto.toJson());
          }
        }
      }
      return res.status(404).json({ status: 'Producto no encontrado.' });
    } catch (error) {
      return res.status(500).json({ status: `${error}` });
    }
  };

  /**
   * [async description]
   *
   * @param   {[type]}  req   [req ingresa id de producto]
   * @param   {[type]}  res   [res description]
   * @param   {[type]}  next  [next ]
   *
   * @return  {[type]}        [return se retorna el producto si es que se agrega]
   */
  addProducto = async (req, res, next) => {
    try {
      if (req.params.id) {
        //No existe condición para agregar producto repetidos
        let producto = await this.api.findOneProducto(req.params.id);
        
        if (producto) {
          const record = {
            timestamp: Math.floor(Date.now() / 1000),
            carrito_session: req.user.id,
            title: producto.getTitle(),
            price: Number(producto.getPrice()),
            stock: Number(producto.getStock()),
            code: producto.getCode(),
            name: producto.getName(),
            thumbail: producto.getThumbail(),
            description: producto.getDescription(),
          };

          const ok = await this.api.add(record);
          if (ok){
            return res.status(201).json(ok.toJson());
          }else{
            return res.status(500).json({ status: 'Falla producto no se puedo guardar.' });      
          }
        }

        //No me piden controlar repetido
      }
      return res.status(404).json({ status: 'Producto no encontrado.' });
    } catch (error) {
      return res.status(500).json({ status: `${error}` });
    }
  };

  /**
   * [async description]
   *
   * @param   {[type]}  req   [req ingrsa id de carrito]
   * @param   {[type]}  res   [res description]
   * @param   {[type]}  next  [next description]
   *
   * @return  {[type]}        [return retorna el carro-producto]
   */
  deleteProducto = async (req, res, next) => {
    try {
      if (req.params.id) {
        const carrito = await this.api.getOne(req.params.id);
        if (carrito) {
          const eliminado = await this.api.deleteOne(req.params.id);
          if (eliminado) {
            return res.status(200).json(eliminado.toJson());
          }else{
            return res.status(500).json({ status: 'No se ha podido eliminar el producto del carrito.' });
          }
        }
      }
      return res.status(404).json({ status: 'Producto no encontrado.' });
    } catch (error) {
      return res.status(500).json({ status: `${error}` });
    }
  };

  makeAndOrder = async (req, res, next) => {
    
    try {
      
        const result = await this.api.generateOrder(req.user);

        if (result.SUCCESS){
          return res.status(200).json({
            SUCCESS:'La orden fue generada.',
            fail: false
          });
        }

        return res.status(500).json(result);

    } catch (error) {

      logger.debug(`Exception generada en MakeAndOrder: ${error}`);

      return res.status(500).json({
             SUCCESS: false,
             fail: 'Ocurrio un error en el sistema. No fue posible procesar su pedido.',
      });
    }
  };

}

module.exports = CarritoController;
