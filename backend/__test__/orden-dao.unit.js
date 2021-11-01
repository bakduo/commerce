const config = require('../src/config/index');
config.server.dbtype = "mongo";
config.rebuild();

const { expect } = require('chai');
const ProductoDAO = require('../src/dao/producto-dao');
const OrdenDAO = require('../src/dao/orden-dao');

const repo = new ProductoDAO(config.db);
const repoOrden = new OrdenDAO(config.db);

const testRecords = require('./fixtures/loaderfake');
const testUserRecords = require('./fixtures/loaderuserfake');

//const uuid = require('uuid');
let userFake;
let productosFake = [];
let ordenGenerada;
let productosComprados;

describe('Test Orden DAO UNIT',() => {
    
    before(async function(){
        console.log("###############BEGIN TEST#################");
        productosFake = testRecords.load();
        userFake = testUserRecords.getOneUser();
    });

    after(async () => {
        console.log("###############CLEAR DB TEST#################");
        await repo.deleteAll();
        await repoOrden.deleteAll();
    })

    //Load datastore
    beforeEach(async () => {
    
    });

    //Clean datastore
    afterEach(async () => {
           
    });
 
   
    describe('Generar orden de producto ', () => {
        
        it('debería realizar una orden con estado generado', async () => {

            //const id = uuid.v4();
            let productosCarrito = [];
            
            const p1 = await repo.save(productosFake[0]);
            const p2 = await repo.save(productosFake[1]);
            const p3 = await repo.save(productosFake[2]);

            productosCarrito.push(p1.getId());
            productosCarrito.push(p2.getId());
            productosCarrito.push(p3.getId());

            const ordenUsuario = {
              email:userFake.email2,
              estado:'generado',
              productos: productosCarrito
            }

            ordenGenerada = await repoOrden.save(ordenUsuario);
            expect(ordenGenerada.toJson()).to.include.keys('estado','email','timestamp','productos','id');
            expect(ordenGenerada.getEmail()).to.eql(userFake.email2);
            expect(ordenGenerada.getEstado()).to.eql(ordenUsuario.estado);
            expect(ordenGenerada.getProductos()).to.be.a('array');
        })
    });

    describe('Retornar los productos de una orden', () => {
        
      it('debería retornar los productos del carrito.', async () => {

          productosComprados = await repoOrden.getItemsOfCompra(ordenGenerada.getId(),'productos');
          expect(productosComprados).to.be.a('array');
          expect(productosComprados).length.greaterThanOrEqual(3);
      })
  });

  describe('Check productos de la orden', () => {
        
    it('deberían ser todos productos', async () => {
        const p1 = productosComprados[0];
        const p2 = productosComprados[1];
        const p3 = productosComprados[2];
        expect(p1.toJson()).to.include.keys('id','name','stock','price');
        expect(p2.toJson()).to.include.keys('id','name','stock','price');
        expect(p3.toJson()).to.include.keys('id','name','stock','price');
    })
});
  





});