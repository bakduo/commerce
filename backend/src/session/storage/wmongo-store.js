'use strict'

const SessionStoreGeneric = require('./session-store-generic');
const MongoStore = require('connect-mongo');

class WMongoStore extends SessionStoreGeneric {

    constructor(...args){
        super(args);
        //Use secret y cipher para las password
        this.url = args[2];
        this.secure = args[3];
        if (Number(this.secure)===1){
            this.options = {useNewUrlParser: true, useUnifiedTopology:true,ssl:true};
        }else{
            this.options = {useNewUrlParser: true, useUnifiedTopology:true,ssl:false};
        }
        
        this.store = MongoStore.create({
            mongoUrl : this.url,
            mongoOptions: this.options,
        });

    }

    getConnection(...args){
        return this.store;
    }
}

module.exports = WMongoStore;