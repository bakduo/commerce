// Controller routes

class CarritoController {
  constructor(repository, repositoryProductos) {
    this.repo = repository;
    this.productos = repositoryProductos;
  }

  getProductos = async (req, res, next) => {
    try {
      const productos = await this.repo.getItems();

      if (productos === null) {
        return res.status(400).json({ status: 'No hay productos cargados' });
      }
      return res.status(200).json(productos);
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };

  getProducto = async (req, res, next) => {
    try {
      if (req.params.id) {
        const producto = await this.repo.getId(req.params.id);

        if (producto) {
          return res.status(200).json(producto);
        }
      }

      return res.status(400).json({ status: 'Producto not found.' });
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };

  addProducto = async (req, res, next) => {
    try {
      if (req.params.id) {
        const producto = await this.productos.getId(req.params.id);

        const existe = await this.repo.include(
          producto.code,
          (item, codigo) => {
            return item.code === Number(codigo);
          }
        );

        if (!existe.status) {
          const record = {
            timestamp: Math.floor(Date.now() / 1000),
            carrito_session: req.carrito,
            title: producto.title,
            price: producto.price,
            stock: producto.stock,
            code: producto.code,
            name: producto.name,
            thumbail: producto.thumbail,
            description: producto.description,
          };

          await this.repo.save(record);

          return res.status(200).json(producto);
        } else {
          return res.status(208).json({ status: 'Producto already exists.' });
        }
      }
      return res.status(400).json({ status: 'Producto not found.' });
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };

  deleteProducto = async (req, res, next) => {
    try {
      if (req.params.id) {
        const carrito = await this.repo.getId(req.params.id);

        if (carrito) {
          const eliminado = await this.repo.deleteById(req.params.id);
          if (eliminado) {
            return res.status(200).json(eliminado);
          }
        }
      }

      return res.status(400).json({ status: 'Producto not found' });
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };
}

module.exports = CarritoController;
