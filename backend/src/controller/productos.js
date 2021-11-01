const config = require('../config/index');
const logger = config.logger;
const ApiProductos = require('../api/productos-api');
let permitido = "png,jpg,jpeg";
const fsp = require('fs').promises;
const uuid4 = require("uuid").v4;
const ProductoRepository = require('../repository/producto-repository');

//refactor
class CommandSearch{

  constructor(parameter,repo){
    this.search = parameter;
    this.repo = repo;
  }

  getItems = async () => {
    let items;
    const key = Object.keys(this.search);
    const value = Object.values(this.search);
    if (key.length > 0 && value.length > 0){
      switch (key[0]) {
        case 'code':
          items = await this.repo.getProductosbyCode(value[0]);
          break;
        case 'name':
          items = await this.repo.getProductosbyName(value[0]);
          break;
        case 'stock':
          items = await this.repo.getProductosbyStock(value[0]);
          break;
        case 'price':
          items = await this.repo.getProductosbyPrice(value[0]);
          break;
      }
      return items;
    }
    return false;
  }
}
class ProductoController {
  constructor(productosDao) {
    //this.repo = repository;
    this.api = new ApiProductos(productosDao);
    this.repositoryProducto = new ProductoRepository(productosDao);
  }

  getProductos = async (req, res, next) => {
    try {
      let items = null;

      if (Object.keys(req.query).length > 0) {

       const cmd = new CommandSearch(req.query,this.repositoryProducto);
       items = await cmd.getItems();

       if (items){
        if (items.length>0){
          items = items.map((item)=>{return item.toJson()});
        }
        return res.status(200).json(items);
       }
      } 

      items = await this.api.getAll();

      if (!items) {
        return res.status(400).json({ status: 'No hay productos cargados' });
      }

      if (items.length>0){
        items = items.map((item)=>{return item.toJson()});
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

      let thumbail = "";

      const {price,name,code,description,title,stock} = req.body;

      //Control filename
      const file = req.file;

      if (!file) {
            const error = new Error('Error subiendo archivo')
            error.httpStatusCode = 400
            return next(error.message);
      }
        
      thumbail = config.uploadfolder + req.file.filename;
      
      if (req.body) {

          const exist = await this.api.getProductoOfCode(req.body.code)
          if (!exist) {
            const producto = {price,name,code,description,title,stock,thumbail};
            const tmp1 = await this.api.add(producto);
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

  checkEncoding = async (thumbailsrc) => {
    let thumbail = "";

    if (thumbailsrc){

      try {
        let imageParts = thumbailsrc.split(";base64,");
        let imagaTypeAux = imageParts[0].split("image/");
        let imageType = imagaTypeAux[1];
        let formatoPermitidos = permitido.split(",");
        if (formatoPermitidos.includes(imageType)){
          thumbail =  config.uploadfolder + "/" + "commerce_" + uuid4().replace(/-/g, "") + '.' + imageType;
          const buff = Buffer.from(imageParts[1], 'base64');
          await fsp.writeFile(thumbail,buff);
        }

        return thumbail;

      } catch (error) {
        // let estado = new Error('Error al realizar converción de imagen base64...')
        // error.httpStatusCode = 400
        // return next(estado.message);
        return res.status(500).json({ status: 'Producto no es valido, verificar encoding image.' });
      }
    }else{
      return res.status(500).json({ status: 'Producto no es valido, verificar que tenga una imagen.' });
    }
  }

  postProductoEncoding = async (req, res, next) => {
    try {
      
      logger.debug("#######POST PRODUCT######");

      if (req.customblock) {
        return res.status(200).json(req.customerror);
      }

        let thumbail = "";

        const {price,name,code,description,title,stock,thumbailsrc} = req.body;

        thumbail = await this.checkEncoding(thumbailsrc);


      if (req.body) {

        //const search = new IncludeProductos(this.repo);
        //const existe = await search.execute(req.body.code, (item, codigo) => {
        //  return item.code === Number(codigo);
        //});
          const producto = {price,name,code,description,title,stock,thumbail};
                    
          if (!this.api.isValidate(producto)){

            logger.debug("Producto no valido");

            return res.status(500).json({ status: 'Producto no es valido, verificar campos.' });

          }

          const exist = await this.api.getProductoOfCode(req.body.code)
          //console.log(exist);
          if (!exist) {
            
            const tmp1 = await this.api.add(producto);
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
      return res.status(400).json({ status: `${req.customblock}` });
    } catch (error) {
      return res.status(500).json({ status: `${error}` });
    }
  };

  putProductoEncoding = async (req, res, next) => {
    try {
      if (!req.customblock) {
        const exist = await this.api.getOne(req.params.id);

        if (exist){

          const {price,name,code,description,title,stock,thumbailsrc} = req.body;

          let thumbail = exist.getThumbail();

          if (thumbailsrc){
            thumbail = await this.checkEncoding(thumbailsrc);
          }
          
          const producto = {price,name,code,description,title,stock,thumbail};

          const update = await this.api.update(req.params.id,producto);

          if (update) {
            return res.status(200).json(update.toJson());
          }else{
            return res.status(500).json({ status: 'Producto no fue actualizado, verificar campos.' });
          }
        }else{
          return res.status(404).json({ status: 'Producto no existe.' });
        }
      }
      return res.status(400).json({ status: `${req.customblock}` });
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
              return res.status(200).json(deleteProduct.toJson());
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
