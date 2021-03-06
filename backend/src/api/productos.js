// Controller routes

const Producto = require('../model/producto');

class ProductoController {
  constructor(serv, repository) {
    this.srv = serv;
    this.repo = repository;
  }

  getVista = (req, res, next) => {
    const items = this.repo.getItems();

    if (items == null) {
      return res.render('productos', {
        productos: null,
        state: false,
      });
    }

    return res.render('productos', {
      productos: items,
      state: true,
    });
  };

  getProductos = (req, res, next) => {
    try {
      const items = this.repo.getItems();

      if (items == null) {
        return res.status(400).json({ status: 'No hay productos cargados' });
      }

      return res.status(200).json(items);
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };

  getProducto = (req, res, next) => {
    try {
      if (!req.customblock) {
        if (req.params.id) {
          const producto = this.repo.getId(Number(req.params.id));
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

  postProducto = async (req, res, next) => {
    try {
      if (!req.customblock) {
        if (req.body) {
          const { title, price, thumbail } = req.body;

          const id = this.repo.getSize();

          const p = Producto.getProducto(title, id, thumbail, price);

          const tmp1 = await this.repo.save(p);

          if (tmp1) {
            return res.status(200).json(tmp1);
          }
        }
      }

      return res.status(200).json({
        status: {
          kind: req.customerror.kind,
          descript: req.customerror.descript,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };

  putProducto = (req, res, next) => {
    try {
      if (!req.customblock) {
        const { title, price, thumbail } = req.body;

        const p = Producto.getProducto(
          title,
          this.repo.getSize(),
          thumbail,
          price
        );

        const update = this.repo.updateById(Number(req.params.id), p);

        if (update) {
          return res.status(200).json(update);
        }
      }
      return res.status(400).json({ status: 'Producto no encontrado' });
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };

  deleteProducto = (req, res, next) => {
    try {
      if (!req.customblock) {
        if (req.params.id) {
          const existe = this.repo.getId(Number(req.params.id));

          if (existe) {
            const deleteProduct = this.repo.deleteById(Number(req.params.id));

            if (deleteProduct !== null) {
              return res.status(200).json(deleteProduct);
            }
          }
        }
      }
      return res
        .status(400)
        .json({ status: 'Producto no encontrado para eliminar' });
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };
}

module.exports = ProductoController;
