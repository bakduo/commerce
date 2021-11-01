const ProductoModel = require("../model/producto-model");
const config = require('../config/index');
const logger = config.logger;

class ProductosApi {
    
    constructor(repo){
        this.repo = repo;
        this.model = new ProductoModel();
    }


    isValidate(body){
        return this.model.validate(body);
    }


    getProductoOfCode = async (code)=>{
        const prod = await this.repo.find({query:{key:'code',value:code}});
        if (prod){
            return prod;
        }
        return false;
    }

    // findOne = async (value) => {
    //     const exist = await this.repo.find({query:{key:'code',value:value}});
    //     if (exist){
    //         return true
    //     }
    //     return false;
    // }

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

module.exports = ProductosApi;