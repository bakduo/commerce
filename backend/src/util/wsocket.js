
const ProductoService = require('../services/producto-sevice.js');

const ArchivoRepository = require("../repository/archivo-repository");

const service = new ProductoService();

const PATH_DB=process.env.PATH_DB || "/db/storage.db";

const archivo = new ArchivoRepository(PATH_DB);

const vector = [];

const TOTAL = 100;

let contador = 0;

class WSocket {
    
    cs = null;

    clients = null;

    constructor(socket){

        this.cs = socket;
        
        this.clients = [];

    }

    addClient(client){

        this.clients.push(client);
    }

    closeAll(){
        
        this.clients.forEach(element => {
            element.close();
        });

    }

    getClient(id){
        
        const clientIndex = this.clients.findIndex((con)=>con.id === id);
        if (clientIndex>=0){
            return this.clients[clientIndex];
        }
        return null;
    }

    addOperation(canal){

        canal.on("procesar",data=>{
            const producto = {
                title: data.title,
                price: data.price,
                thumbail: data.thumbail
            }

            service.addProducto(producto);
            const items = service.getProductos();
            //client
            canal.emit("renderproductos",items);
            //all broadcast
            canal.broadcast.emit("renderproductos",items);
        });

        canal.on("getproductos",data=>{
            //client
            const items = service.getProductos();
            canal.emit("renderproductos",items);
        });

        canal.on("getmsg",async data=>{
            //client
            const items = await archivo.readFile();
            canal.emit("rendermsg",items);
        });

        canal.on("appendmsg",async data =>{

            if (contador < TOTAL){
                
                const feeback = {
                    msg:data.msg,
                    tiempo:data.tiempo,
                    user:data.user
                }

                vector.push(feeback);
                await archivo.save(vector);
                canal.broadcast.emit("reloadmsg",feeback);
                contador++
            }else{
                canal.emit("overflow",{});
            }
        })

    }


    init(){

        this.cs.on('connection',async (canal) => {
            this.addOperation(canal); 
            canal.emit("getClient",{});
            
        });
    }

}

module.exports = WSocket;