class FakeSession {
  static instancia;

  constructor(datastore) {
    if (!!FakeSession.instancia) {
      return FakeSession.instancia;
    }

    this.items = datastore.getInstanceDB('memory');

    FakeSession.instancia = this;
  }

  saveItem = async (data) => {
    await this.items.save(data);
  };

  getItem(key) {
    const pattern = (item, valor) => {
      return item.id === valor;
    };

    return this.items.searchItem(key, pattern);
  }

  update(key, data) {
    let item = this.getItem(key);
    if (item !== null) {
      item = data;
    }
  }
}

module.exports = FakeSession;
