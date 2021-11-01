const Joi = require('joi');

class OrdenModel {
    
    constructor(){
        this.schema = this.initSchema();
    };

    initSchema(){
        const OrdenSchema = Joi.object().keys({
            email:Joi.string().required(),
            estado:Joi.string().required(),
            productos:Joi.array().required(),
        });
        return OrdenSchema;
    };

    validate(body){
        const result = this.schema.validate(body);
        const { value, error } = result; 
        const valid = error == null; 
        
        if (!valid) { 
            return false
        }
        return true;
    };
}

module.exports = OrdenModel;