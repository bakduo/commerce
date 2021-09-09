// Controller routes

const IncludeProductos = require('../util/busquedas/include-productos');
const config = require('../config/index');
const providerEmail1 = config.emails[0];
const EmailService = require('../services/emailservice');

const SMService = require('../services/smsservice');
const sms = new SMService();
const logger = config.logger;

/**
 * [CarritoController no me gusta este controller pero es lo que piden [carrito1....carriton(producto)]]
 * Desde mi punto de vista deberia ser carrito : { [p1...pn]}.
 */
class CarritoController {
  constructor(repository, repositoryProductos) {
    this.repo = repository;
    this.productos = repositoryProductos;
    this.service = new EmailService();
  }

  /**
   * [async description]
   *
   * @param   {[type]}  req   [req ]
   * @param   {[type]}  res   [res collection de productos carrito]
   * @param   {[type]}  next  [next description]
   *
   * @return  {[type]}        [return retora la collection de  carritos]
   */
  getProductos = async (req, res, next) => {
    try {
      const user = req.user;

      let productos = await this.repo.getItems();
      productos = productos.filter((item) => item.carrito_session == user._id);

      if (productos === null) {
        return res.status(400).json({ status: 'No hay productos cargados' });
      }
      return res.status(200).json(productos);
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };

  /**
   * [async description]
   *
   * @param   {[type]}  req   [req id de carrito]
   * @param   {[type]}  res   [res un carrito]
   * @param   {[type]}  next  [next description]
   *
   * @return  {[type]}        [return un carrito]
   */
  getProducto = async (req, res, next) => {
    try {
      if (req.params.id) {
        const producto = await this.repo.getId(req.params.id);
        const user = req.user;
        if (producto.carrito_session == user._id) {
          return res.status(200).json(producto);
        }
      }

      return res.status(400).json({ status: 'Producto not found.' });
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };

  /**
   * [async description]
   *
   * @param   {[type]}  req   [req ingresa id de producto]
   * @param   {[type]}  res   [res description]
   * @param   {[type]}  next  [next ]
   *
   * @return  {[type]}        [return se retorna el producto si es que se agrega]
   */
  addProducto = async (req, res, next) => {
    try {
      if (req.params.id) {
        //No existe condición para agregar producto repetidos

        const producto = await this.productos.getId(req.params.id);

        //control de repeticiones
        // const search = new IncludeProductos(this.repo);
        // const existe = await search.execute(producto.code, (item, codigo) => {
        //   return item.code === Number(codigo);
        // });
        // const existe = await this.repo.include(
        //   producto.code,
        //   (item, codigo) => {
        //     return item.code === Number(codigo);
        //   }
        // );

        if (producto) {
          const record = {
            timestamp: Math.floor(Date.now() / 1000),
            carrito_session: req.user._id,
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
        }

        //No me piden controlar repetido

        // } else {
        //   return res.status(208).json({ status: 'Producto already exists.' });
        // }
      }
      return res.status(400).json({ status: 'Producto not found.' });
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  };

  /**
   * [async description]
   *
   * @param   {[type]}  req   [req ingrsa id de carrito]
   * @param   {[type]}  res   [res description]
   * @param   {[type]}  next  [next description]
   *
   * @return  {[type]}        [return retorna el carro-producto]
   */
  deleteProducto = async (req, res, next) => {
    try {
      if (req.params.id) {
        //Traer todos los productos del usuario y eliminarlos los correspondientes

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

  makeAndOrder = async (req, res, next) => {
    const user = req.user;
    logger.info(
      '###############Administrador procesa pedido para procesar#############'
    );

    logger.info(
      '##########Deberia enviar mail de registro al administrador##############'
    );
    /*******************SMS */
    if (config.sms.fromtel) {
      try {
        const texto =
          'Usted: ' +
          user.nombre +
          'email: ' +
          user.email +
          'solicito el envio de su pedido. En la brevedad nos ponemos en contacto con usted.';
        logger.info('########SMS: ' + texto + '#################');
        sms.send(texto, user.tel);

        /******************Correo */

        let productos = await this.repo.getItems();
        productos = productos.filter(
          (item) => item.carrito_session == user._id
        );

        if (productos.length <= 1) {
          return res.status(500).json({
            SUCCESS: null,
            fail: 'Ustes no tiene los productos suficientes para realizar el envio',
          });
        }

        let productosText = '';
        productos.forEach((item) => {
          productosText = productosText + '<li>' + item.name + '</li>';
        });

        const fechaLogin = new Date().toISOString();
        this.service.initialize(providerEmail1);
        this.service.setFrom('Sistemas registro de envios');
        this.service.send(
          'Se registro nuevo envio de ' + user.email,
          config.email_to,
          `
                <i>Usuario solicito envio de: </i>
                <br>
                <ul>
                
                  ${productosText}

                </ul> 
                <b> 
                  ${fechaLogin} 
                  <hr>
                </b>
                `
        );
      } catch (error) {
        logger.error(`Error Al procesar pedido: ${error}`);
        throw new Error('Error al procesar pedido');
      }
    } else {
      logger.error(
        '######################No hay telefono configurado para la salida del pedido#####################'
      );
      return res.status(500).json({
        SUCCESS: null,
        fail: 'No hay linea disponible para procesar el pedido',
      });
    }

    return res.status(200).json({ SUCCESS: 'Order incomming...', fail: null });
  };
}

module.exports = CarritoController;
