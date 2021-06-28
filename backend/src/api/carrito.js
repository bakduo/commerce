// Controller routes

const config = require('../config/index');

const Carrito = require('../model/carrito');

class CarritoController {
  constructor(repository, repositoryProductos) {
    this.repo = repository;
    this.productos = repositoryProductos;
    //memory fake
    this.repo.getProductos();
  }

  getProductos = async (req, res, next) => {
    try {
      //const carrito = new Cart(req.session.cart ? req.session.cart : {});
      const productos = this.repo.getSource().getItems();
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
        const nameProducto = req.query.name;
        const carritoID = req.carrito;
        const productos = this.repo.getSource().getItems();
        if (String(req.params.id) === String(carritoID)) {
          const producto = productos.find(
            (item) => item.producto.name === nameProducto
          );
          if (producto) {
            return res.status(200).json(producto);
          }
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
        //get producto DB fake
        const producto = this.productos
          .getSource()
          .getId(Number(req.params.id));
        if (producto) {
          const carritoID = req.carrito;

          const carrito_con_producto = Carrito.getCarrito(carritoID, producto);

          await this.repo.save(carrito_con_producto);

          return res.status(200).json(producto);
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
        //const carritoID = req.carrito;

        const productos = this.repo.getSource().getItems();

        this.repo
          .getSource()
          .replaceAll(
            productos.filter(
              (item) => item.producto.id !== Number(req.params.id)
            )
          );

        await this.repo.getSource().sync();

        return res.status(200).json({ producto: req.params.id });
      }

      return res
        .status(400)
        .json({ status: 'Producto no encontrado para eliminar' });
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };
}

module.exports = CarritoController;
