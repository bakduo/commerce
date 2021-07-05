// Controller routes

const Producto = require('../model/producto');

class ProductoController {
  constructor(serv, repository) {
    this.srv = serv;
    this.repo = repository;
  }

  getVista = (req, res, next) => {
    const items = this.repo.getSource().getItems();

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

  getProductos = async (req, res, next) => {
    try {
      const items = await this.repo.getSource().getItems();

      if (items == null) {
        return res.status(400).json({ status: 'No hay productos cargados' });
      }

      return res.status(200).json(items);
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };

  getProducto = async (req, res, next) => {
    try {
      if (!req.customblock) {
        if (req.params.id) {
          const producto = await this.repo
            .getSource()
            .getId(Number(req.params.id));
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
      if (req.customblock) {
        return res.status(200).json(req.customerror);
      }

      if (req.body) {
        const tmp1 = await this.repo.save(req.body);
        if (tmp1) {
          return res.status(200).json(tmp1);
        }
      }
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };

  putProducto = async (req, res, next) => {
    try {
      if (!req.customblock) {
        const idP = Number(req.params.id);

        const update = await this.repo.updateById(idP, req.body);

        if (update) {
          return res.status(200).json(update);
        }
      }
      return res.status(400).json(req.customerror);
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };

  deleteProducto = async (req, res, next) => {
    try {
      if (!req.customblock) {
        if (req.params.id) {
          const existe = await this.repo
            .getSource()
            .getId(Number(req.params.id));

          if (existe) {
            const deleteProduct = await this.repo.deleteById(
              Number(req.params.id)
            );

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
