const SessionStoreGeneric = require('./session-store-generic');

class WSessionFile extends SessionStoreGeneric{

    constructor(...args){
        super(['localhost',0]);
        this.path = null;
        this.ttl = null;
        this.retries = null;
        this.session = null;
    }

    getConnection(...args){
        this.path = args[0];
        this.ttl = args[1];
        this.retries = args[2];
        this.session = args[3];
        const FileStore = require('session-file-store')(this.session);
        this.store=new FileStore({
            path:this.path,
            ttl:this.ttl,
            retries:this.retries
        });
        return this.store;
    }
}

module.exports = WSessionFile;