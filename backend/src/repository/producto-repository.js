class ProductoRepository {
  constructor(datasource) {
    this.items = datasource.getStore();

    ProductoRepository.instancia = this;
  }

  async clear() {
    await this.items.clear();
  }

  getIndex(id) {
    const index = this.items.getIndex(id);

    if (index >= 0) {
      return index;
    }

    return -1;
  }

  getItems() {
    return this.items.getItems();
  }

  getId(id) {
    try {
      const p = this.items.getId(id);
      if (p) {
        return p;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  deleteById(id) {
    try {
      const item = this.items.deleteById(id);
      if (item !== null) {
        return item;
      }
      return null;
    } catch (error) {
      throw error;
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
      throw error;
    }
  }

  getSize() {
    return this.items.getSize();
  }

  async save(p) {
    try {
      await this.items.save(p);
      return p;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductoRepository;
