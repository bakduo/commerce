const config = require('../config/index');

const MessageDAO = require('../dao/message-dao');

const repo = new MessageDAO(config.db);

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
