const config = require('../config/index');

const MessageRepository = require('../repository/message-repository');

const repo = new MessageRepository(config.db);

//const vector = [];

const TOTAL = 100;

let contador = 0;

class WSocket {
  constructor(socket) {
    this.cs = socket;

    this.clients = [];
  }

  addClient(client) {
    this.clients.push(client);
  }

  closeAll() {
    this.clients.forEach((element) => {
      element.close();
    });
  }

  getClient(id) {
    const clientIndex = this.clients.findIndex((con) => con.id === id);
    if (clientIndex >= 0) {
      return this.clients[clientIndex];
    }
    return null;
  }

  addOperation(canal) {
    /*canal.on('procesar', (data) => {
      const producto = {
        title: data.title,
        price: data.price,
        thumbail: data.thumbail,
      };

      service.addProducto(producto);
      const items = service.getProductos();
      //client
      canal.emit('renderproductos', items);
      //all broadcast
      canal.broadcast.emit('renderproductos', items);
    });

    canal.on('getproductos', (data) => {
      //client
      const items = service.getProductos();
      canal.emit('renderproductos', items);
    });

    */
    /*
    canal.on('getmsg', async (data) => {
      //client
      const items = await archivo.readFile();
      canal.emit('rendermsg', items);
    });
    */

    canal.on('getmessages', async () => {
      const items = await repo.getItems();
      canal.emit('reloadmsgs', items);
    });

    canal.on('appendmsg', async (data) => {
      if (contador < TOTAL) {
        const feeback = {
          msg: data.msg,
          tiempo: data.tiempo,
          user: data.user,
        };

        //vector.push(feeback);
        //await archivo.save(vector);
        await repo.save(feeback);
        canal.broadcast.emit('reloadmsg', feeback);
        contador++;
      } else {
        canal.emit('overflow', {});
      }
    });
  }

  init() {
    this.cs.on('connection', async (canal) => {
      this.addOperation(canal);
      canal.emit('getClient', {});
    });
  }
}

module.exports = WSocket;
