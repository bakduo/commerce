class Repository {
  constructor(datasource) {
    this.items = datasource.getStore();
  }

  async clear() {
    await this.items.clear();
  }

  getSource() {
    return this.items;
  }

  getIndex(id) {
    const index = this.items.getIndex(id);

    if (index >= 0) {
      return index;
    }

    return -1;
  }

  static handleError(error) {
    throw error;
  }

  deleteById(id) {
    try {
      const item = this.items.deleteById(id);
      if (item !== null) {
        return item;
      }
      return null;
    } catch (error) {
      Repository.handleError(error);
      return null;
    }
  }

  updateById(id, producto) {
    try {
      const p = this.items.updateById(id, producto);
      if (p) {
        return p;
      }
      return null;
    } catch (error) {
      Repository.handleError(error);
      return null;
    }
  }

  async save(p) {
    try {
      await this.items.save(p);
      return p;
    } catch (error) {
      Repository.handleError(error);
      return null;
    }
  }
}

module.exports = Repository;
