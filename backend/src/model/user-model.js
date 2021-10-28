const Joi = require('joi');

class UserModel {
    
    constructor(){
        this.schema = this.initSchema();
    }

    initSchema(){
        const userSchema = Joi.object().keys({
            nombre:Joi.string().required(),
            email:Joi.string().required(),
            direccion: Joi.string().required(),
            edad:Joi.number().required(),
            tel: Joi.string().required(), 
            avatar:Joi.string().required(),
        });
        return userSchema;
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

module.exports = UserModel;