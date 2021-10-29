const config = require('../src/config/index');
config.server.dbtype = "mongo";
config.rebuild();
const app = require('../src/app');
const { expect } = require('chai');
const ProductoDAO = require('../src/dao/producto-dao');
const repo = new ProductoDAO(config.db);
const testRecords = require('./fixtures/loaderfake');
let productosFake = [];

describe('Test Producto DAO UNIT',() => {
    
  before(async function(){
      console.log("###############BEGIN TEST#################");
      repo.deleteAll();
      productosFake = testRecords.load();
  })

  after(async () => {

      console.log("###############CLEAR DB TEST#################");
      repo.deleteAll();
  })

  describe('Add un producto', () => {
    it('debería agregar un productos', async () => {
        
        const p = await repo.save(productosFake[0]);

        expect(p.toJson()).to.include.keys('id','name','stock','price');
    });
  });

   describe('Eliminar un producto', () => {

        it('debería eliminar un productos', async () => {
            const p = await repo.save(productosFake[0]);
            const eliminar = await repo.deleteById(p.getId());
            expect(eliminar.toJson()).to.include.keys('id','name','stock','price');
        });
    });

    describe('Buscar un producto', () => {

        it('deberia encontrar  un productos', async () => {
            const p = await repo.save(productosFake[0]);
            const encontrado = await repo.find({query:{key:'code',value:p.getCode()}});
            expect(encontrado.toJson()).to.include.keys('id','name','stock','price');

        });
    });

    describe('Update un producto', () => {

        it('deberia actualizar un producto', async () => {
            const p = await repo.save(productosFake[3]);
            p.setDescription('cambio');
            p.getName('cambio');
            const encontrado = await repo.updateById(p.getId(),p.toJson());
            expect(encontrado.toJson()).to.include.keys('id','name','stock','price');
            expect(encontrado.getName()).to.eql(p.getName());
            expect(encontrado.getDescription()).to.eql(p.getDescription());

        });
    });


});