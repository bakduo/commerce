class SessionStoreGeneric {
    constructor(...args){
        this.host=args[0];
        this.port=args[1];
    }

    setHost(host){
        this.host = host;
    }

    setPort(port){
        this.port = port;
    }

    getHost(){
        return this.host;
    }

    getPort(){
        return this.port;
    }

    getConnection(...args){
        return null;
    }

}

module.exports = SessionStoreGeneric;