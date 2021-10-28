// Controller routes

const FilterProductos = require('../util/busquedas/filter-productos');

const IncludeProductos = require('../util/busquedas/include-productos');

const config = require('../config/index');
const logger = config.logger;
const ApiProductos = require('../api/productos-api');


class ProductoController {
  constructor(productosDao) {
    //this.repo = repository;
    this.api = new ApiProductos(productosDao);
  }

  getProductos = async (req, res, next) => {
    try {
      let items = null;

      //if (Object.keys(req.query).length > 0) {
      //  const search = new FilterProductos(this.repo);
      //  items = await search.execute(req.query);
      //} else {
        //items = await this.repo.getItems();
      //}

      items = await this.api.getAll();

      if (items == null) {
        return res.status(400).json({ status: 'No hay productos cargados' });
      }

      return res.status(200).json(items);
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };

  getProducto = async (req, res, next) => {
    try {
      if (!req.customblock) {
        if (req.params.id) {
          const producto = await this.api.getOne(req.params.id);
          if (producto) {
            return res.status(200).json(producto.toJson());
          }
        }
      }
      return res.status(400).json({ status: 'Producto not found.' });
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };

  postProducto = async (req, res, next) => {
    try {
      logger.debug("#######POST PRODUCT######");
      if (req.customblock) {
        return res.status(200).json(req.customerror);
      }

      if (req.body) {
        //const search = new IncludeProductos(this.repo);
        //const existe = await search.execute(req.body.code, (item, codigo) => {
        //  return item.code === Number(codigo);
        //});
          const exist = await this.api.findOne(req.body.code)
          if (!exist) {
            const tmp1 = await this.api.add(req.body);
            if (tmp1) {
              logger.debug("####Producto agregado#####");
              return res.status(201).json(tmp1.toJson());
            }else{
              return res.status(500).json({ status: 'Producto no fue almacenado, verificar campos.' });
            }
          }else{
            return res.status(208).json({ status: 'Producto ya existe.' });  
          }
      }
      return res.status(400).json({ status: 'Parametro incorrecto.' });
    }catch (error){
      return res.status(500).json({ status: `${error}` });
    }
  };

  putProducto = async (req, res, next) => {
    try {
      if (!req.customblock) {
        const exist = await this.api.getOne(req.params.id);
        if (exist){
          const update = await this.api.update(req.params.id,req.body);       
          if (update) {
            return res.status(200).json(update.toJson());
          }else{
            return res.status(500).json({ status: 'Producto no fue actualizado, verificar campos.' });
          }
        }else{
          return res.status(404).json({ status: 'Producto no existe.' });  
        }
      }
      return res.status(400).json(req.customerror);
    } catch (error) {
      return res.status(500).json({ status: `${error}` });
    }
  };

  deleteProducto = async (req, res, next) => {
    try {
      if (!req.customblock) {
        if (req.params.id) {
          const existe = await this.api.getOne(req.params.id);
          if (existe) {
            const deleteProduct = await this.api.deleteOne(req.params.id);
            if (deleteProduct !== null) {
              return res.status(200).json(deleteProduct);
            }else{
              return res.status(500).json({status:'No es posible eliminar el producto.'});
            }
          }
        }
      }
      return res
        .status(404)
        .json({ status: 'Producto no encontrado para eliminar' });
    } catch (error) {
      return res.status(500).json({ status: `${error}` });
    }
  };

 
}



module.exports = ProductoController;
