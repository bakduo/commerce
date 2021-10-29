const CarritoModel = require("../model/carrito-model");
const config = require('../config/index');
const logger = config.logger;

class CarritosApi {
    
    constructor(repo,repoproductos){
        this.repo = repo;
        this.repoproductos = repoproductos;
        this.model = new CarritoModel();
    }

    findOneProducto = async (value) => {
        const exist = await this.repoproductos.getId(value);
        if (exist){
            return exist
        }
        return false;
    }

    add = async (producto) =>{
      
        const valid = this.model.validate(producto);
        
        if (valid){
            return await this.repo.save(producto);
        }
        return false;
    }

    deleteOne = async (id) => {
        try {
            
            const existe = await this.repo.getId(id);
            
            if (existe) {          
                const producto = await this.repo.deleteById(id);
                if (producto) {
                    return producto;
                } else {
                    logger.error(`Error producto no se puede eliminar ${error}`);
                }
            }
            return false;    
        } catch (error) {
            logger.debug(`Error: ${error}`);
            return false;
        }
        
    }

    update = async (id,producto) =>{
        try {
            if (id) {
                const valid = this.model.validate(producto);
                if (valid){
                    const update = await this.repo.updateById(id, producto);
                    return update;
                }
            }
            return false    
        } catch (error) {
            logger.debug(`Error: ${error}`);
            return false;
        }   
    }

    getOne = async (id) =>{
        try {
            const producto = await this.repo.getId(id);
            if (producto){
              return producto;
            }
            return false    
        } catch (error) {
            logger.debug(`Error ${error}`);
            return false;
        }
    }

    getAll = async () => {
        const listaProductos = await this.repo.getItems(); 
        
        if (listaProductos) {
            return listaProductos;
        }
        return false;
    }

}

module.exports = CarritosApi;