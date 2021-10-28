const Joi = require('joi');

class ProductoModel {
    
    constructor(){
        this.schema = this.initSchema();
    }

    initSchema(){
        const productoSchema = Joi.object().keys({
            title:Joi.string().required(),
            description:Joi.string().required(),
            name: Joi.string().required(),
            stock:Joi.number().required(),
            code: Joi.string().required(), 
            price:Joi.number().required(),
            thumbail:Joi.string().required()
        });
        return productoSchema;
    }

    validate(body){
        const result = this.schema.validate(body);
        const { value, error } = result; 
        const valid = error == null; 
        
        if (!valid) { 
            return false
        }

        return true;
    }
}

module.exports = ProductoModel;