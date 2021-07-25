// Controller routes

const FilterProductos = require('../util/busquedas/filter-productos');

const IncludeProductos = require('../util/busquedas/include-productos');

class ProductoController {
  constructor(repository) {
    this.repo = repository;
  }

  getVista = async (req, res, next) => {
    const items = await this.repo.getItems();

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
      let items = null;

      if (Object.keys(req.query).length > 0) {
        const search = new FilterProductos(this.repo);
        items = await search.execute(req.query);
      } else {
        items = await this.repo.getItems();
      }

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
          const producto = await this.repo.getId(req.params.id);
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
        const search = new IncludeProductos(this.repo);
        const existe = await search.execute(req.body.code, (item, codigo) => {
          return item.code === Number(codigo);
        });

        if (!existe.status) {
          const tmp1 = await this.repo.save(req.body);
          if (tmp1) {
            return res.status(200).json(tmp1);
          }
        } else {
          return res.status(208).json({ status: 'Producto already exists.' });
        }
      }
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };

  putProducto = async (req, res, next) => {
    try {
      if (!req.customblock) {
        const existe = await this.repo.getId(req.params.id);

        if (existe) {
          // console.log(existe);
          // existe.name = req.body.name;
          // existe.stock = req.body.stock;
          // existe.price = req.body.stock;
          // existe.code = req.body.code;
          // existe.description = req.body.description;
          // existe.thumbail = req.body.thumbail;
          // existe.title = req.body.title;
          const update = await this.repo.updateById(req.params.id, req.body);

          if (update) {
            return res.status(200).json(update);
          }
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
          const existe = await this.repo.getId(req.params.id);

          if (existe) {
            const deleteProduct = await this.repo.deleteById(req.params.id);

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
