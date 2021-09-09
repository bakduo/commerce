const SessionStoreGeneric = require('./session-store-generic');

const redis = require('redis');
const client = redis.createClient();

class WRedisStore extends SessionStoreGeneric{

    constructor(...args){
        super(args);
        this.client = client;
        this.ttl = null;
        //args[4] = session
        this.session = null;
    }

    getConnection(...args){
        this.ttl = args[0];
        //args[4] = session
        this.session = args[1];
        const RedisStore = require('connect-redis')(this.session);
        this.store = new RedisStore({
            host: this.host,
            port: this.port,
            client: this.client,
            ttl: this.ttl
        })
        return this.store;
    }
}

module.exports = WRedisStore;