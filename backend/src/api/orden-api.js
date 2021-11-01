const config = require('../config/index');
const OrdenModel = require('../model/orden-model');
const logger = config.logger;
const providerEmail1 = config.emails[0];
const EmailService = require('../services/emailservice');
const SMService = require('../services/smsservice');
const ProductosApi = require("./productos-api");
const sms = new SMService();
const {asyncForEach} = require('../util/utils');
const CarritosApi = require('./carrito-api');

class OrdenApi {

    constructor(repo,repoproductos,repoCarrito){
      this.repo = repo;
      this.apiProductos = new ProductosApi(repoproductos);
      this.model = new OrdenModel();
      this.service= new EmailService();
      this.apiCarrito = new CarritosApi(repoCarrito);
    }

    deleteOne = async (id) => {
      try {
          
          const orden = await this.repo.getId(id);
          
          if (orden) {          
              const ordenEliminada = await this.repo.deleteById(id);
              if (ordenEliminada) {
                  return ordenEliminada;
              } else {
                  logger.error(`Error orden no se puede eliminar ${error}`);
              }
          }
          return false;    
      } catch (error) {
          logger.debug(`Exception deleteOne OrderApi: ${error}`);
          return false;
      };   
    }

    getProductos = async (id) =>{

      try {

        let productosComprados = await this.repo.getItemsOfCompra(id,'productos');

        return productosComprados;

      } catch (error) {

        logger.debug(`Exception getProductos OrdenAPI: ${error}`);

        return false; 
      }
    }

    buildOrder = async (email,productos) => {
      try {

          const getProductosComprados = async (productos)=>{

              let codigos = productos.map((item)=>{
                  return item.getCode();
              })

              let productosComprados = [];

              await asyncForEach(codigos,async (item)=> {
                  let p2 = await this.apiProductos.getProductoOfCode(item);
                  productosComprados.push(p2.getId());
              });

              return productosComprados;
          }

          const productosUsuario = await getProductosComprados(productos);
      
          const ordenUsuario = {
              email:email,
              estado:'generado',
              productos: productosUsuario
          };

          const ordenGenerada = await this.add(ordenUsuario);

          return ordenGenerada;

      }catch(error) {
          logger.debug(`Exception generada en buildOrder ${error}`);
          return false;
      };
  };

  generateOrder = async (user) =>{
      
      logger.info(
        '###############Administrador procesa pedido#############'
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
          let productos = await this.apiCarrito.getAll();
          productos = productos.filter(
            (item) => item.getCarritoSession() == user.id
          );

          if (productos.length <= 0) {
            return false;
          }
  
          let productosText = '';
          productos.forEach((item) => {
            productosText = productosText + '<li>' + item.getName() + '</li>';
          });

          logger.debug(
            '##########Deberia enviar mail con los datos del producto##############'
          );

          const ordenGenerada = await this.buildOrder(user.email,productos);

          if (ordenGenerada){

            if (this.apiCarrito.clear(user.id)){
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

              return ordenGenerada;

            }else{

              await this.deleteOne(ordenGenerada.getId());

              return false;

            }     
          };
        } catch (error) {
          logger.error(`Error Al procesar pedido: ${error}`);
          return false;
        }
      } else {
        logger.error(
          '######################No hay telefono configurado para la salida del pedido#####################'
        );
        return false;
      }
   }

    getAllOrderByUser = async (email) => {

        let ordenes = await this.repo.getItems();

        if (ordenes){

          const ordenesUser = ordenes.map((item)=>{
            if (item.getEmail()===email){
              return item;
            }
          })
  
          if (ordenesUser){
              return ordenesUser;
          }

        }

        return false;
    }

    getOne = async (id) =>{
      try {
          const orden = await this.repo.getId(id);
          if (orden){
          return orden;
          }
          return false    
      } catch (error) {
          logger.debug(`Exception getOne OrdenAPI: ${error}`);
          return false;
      }
  }

    getAll = async () => {
      return this.repo.getItems();
    }

    add = async (o) =>{
      try {
          if (this.model.validate(o)){
            return this.repo.save(o);
          }
    
          return false;  

      } catch (error) {

        logger.debug(`Exception en save de OrdenAPI ${error}`);

        return false;  
      }
    }


    update = async (id,orden) =>{

      try {
          if (id) {
              const valid = this.model.validate(orden);
              if (valid){
                  const update = await this.repo.updateById(id, orden);
                  return update;
              }
          }
          return false    
      } catch (error) {
          logger.debug(`Exception en update de OrdenAPI : ${error}`);
          return false;
      }   
    }

}

module.exports = OrdenApi;