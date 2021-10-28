const config = require('../src/config/index');
config.server.dbtype = "mongo";
config.rebuild();

const app = require('../src/app');

const request = require('supertest')(app);
const { expect } = require('chai');
const ProductoDAO = require('../src/dao/producto-dao');
const UserDAO = require('../src/dao/user-dao');
const CredentialDAO = require('../src/dao/credential-dao');
const CarritoDAO = require('../src/dao/carrito-dao');

const repoUser = new UserDAO(config.db);
const repoCredential = new CredentialDAO(config.db);
const repo = new ProductoDAO(config.db);
const repoCarrito = new CarritoDAO(config.db);
const testRecords = require('./fixtures/loaderfake');
const testUserRecords = require('./fixtures/loaderuserfake');

let productosFake = [];
let token = '';
let carritosCargados =  [];



describe('Test Carrito UNIT',() => {
    
    before(async function(){
        console.log("###############BEGIN TEST#################");
        repoCarrito.deleteAll();
        repo.deleteAll();
        repoUser.deleteAll();
        repoCredential.deleteAll();

        productosFake = testRecords.load();
        user = testUserRecords.getOneUser();
        let responseUser = await request.post('/api/signup').send(user);
        expect(responseUser.status).to.eql(200);
        const loginuser = {
            email:user.email,
            password:user.password
        }
        responseUser = await request.post('/api/login').send(loginuser);
        expect(responseUser.status).to.eql(200);
        const responseUserData = responseUser.body;
        expect(responseUserData).to.be.a('object');
        expect(responseUserData).to.include.keys('SUCCESS','fail','token');
        token = responseUserData.token;
    })

    after(async () => {

        console.log("###############CLEAR DB TEST#################");
    })

    //Load datastore
    beforeEach(async () => {
        const load = async () => {
            productosFake.forEach(async (item)=>{
                await repo.save(item);
            })
        }
        await load();
    });

    //Clean datastore
    afterEach(async () => {
        const clear = async () =>{
            productosFake.forEach(async (item)=>{
                const p = await repo.find({query: {'key':'name','value':item.name}});
                if (p){
                    const borrado = await repo.deleteById(p.id);
                }
            })
        }
        await clear();   
    });
 
    describe('GET Carrito', () => {
        it('debería retornar lista de productos', async () => {
            let response = await request.get('/api/carrito/listar').set('Authorization',`bearer ${token}`);
            expect(response.status).to.eql(200);
            const productos = response.body;
            expect(productos).to.be.a('array');
            
        });
    })

    describe('POST producto al carrito I', () => {
        it('debería incorporar un producto', async () => {
            
            const p = await repo.find({query: {'key':'code','value':productosFake[0].code}});
            let response = await request.post(`/api/carrito/agregar/${p.id}`).set('Authorization',`bearer ${token}`).send()
            expect(response.status).to.eql(201);
            const productoSave = response.body;
            expect(productoSave).to.include.keys('price','name','thumbail','code','description','title','stock');
            expect(productoSave.description).to.eql(p.description)
            expect(productoSave.code).to.eql(p.code)
            expect(productoSave.stock).to.eql(p.stock)
            expect(productoSave.title).to.eql(p.title)
            expect(productoSave.price).to.eql(p.price)
            expect(productoSave.thumbail).to.eql(p.thumbail)
            expect(productoSave.name).to.eql(p.name);
        })
    })

    describe('POST producto al carrito II', () => {
      it('debería incorporar un producto', async () => {
          
          const p = await repo.find({query: {'key':'code','value':productosFake[1].code}});
          let response = await request.post(`/api/carrito/agregar/${p.id}`).set('Authorization',`bearer ${token}`).send()
          expect(response.status).to.eql(201);
          const productoSave = response.body;
          expect(productoSave).to.include.keys('price','name','thumbail','code','description','title','stock');
          expect(productoSave.description).to.eql(p.description)
          expect(productoSave.code).to.eql(p.code)
          expect(productoSave.stock).to.eql(p.stock)
          expect(productoSave.title).to.eql(p.title)
          expect(productoSave.price).to.eql(p.price)
          expect(productoSave.thumbail).to.eql(p.thumbail)
          expect(productoSave.name).to.eql(p.name);
      })
  })

  describe('POST producto al carrito III', () => {
    it('debería incorporar un producto', async () => {
        
        const p = await repo.find({query: {'key':'code','value':productosFake[2].code}});
        let response = await request.post(`/api/carrito/agregar/${p.id}`).set('Authorization',`bearer ${token}`).send()
        expect(response.status).to.eql(201);
        const productoSave = response.body;
        expect(productoSave).to.include.keys('price','name','thumbail','code','description','title','stock');
        expect(productoSave.description).to.eql(p.description)
        expect(productoSave.code).to.eql(p.code)
        expect(productoSave.stock).to.eql(p.stock)
        expect(productoSave.title).to.eql(p.title)
        expect(productoSave.price).to.eql(p.price)
        expect(productoSave.thumbail).to.eql(p.thumbail)
        expect(productoSave.name).to.eql(p.name);
    })
  })


  describe('POST producto al carrito IV', () => {
    it('debería incorporar un producto', async () => {    
        const p = await repo.find({query: {'key':'code','value':productosFake[3].code}});
        let response = await request.post(`/api/carrito/agregar/${p.id}`).set('Authorization',`bearer ${token}`).send()
        expect(response.status).to.eql(201);
        const productoSave = response.body;
        expect(productoSave).to.include.keys('price','name','thumbail','code','description','title','stock');
        expect(productoSave.description).to.eql(p.description)
        expect(productoSave.code).to.eql(p.code)
        expect(productoSave.stock).to.eql(p.stock)
        expect(productoSave.title).to.eql(p.title)
        expect(productoSave.price).to.eql(p.price)
        expect(productoSave.thumbail).to.eql(p.thumbail)
        expect(productoSave.name).to.eql(p.name);
    })
  })

  describe('GET Carrito cargados', () => {
    it('debería retornar lista de productos agregados', async () => {
        let response = await request.get('/api/carrito/listar').set('Authorization',`bearer ${token}`);
        expect(response.status).to.eql(200);
        const productos = response.body;
        expect(productos).to.be.a('array');
        expect(productos).length.greaterThanOrEqual(4);
        carritosCargados = productos;
        
    });
  })

    describe('POST producto con error', () => {
        it('No debería incorporar un producto', async () => { 
                  
          let response = await request.post('/api/carrito/agregar/dsfsdfdsfdsfdsfds').set('Authorization',`bearer ${token}`).send()
          const productoSave = response.body;
          expect(response.status).to.eql(404);
          expect(productoSave).to.include.keys('status');
          expect(productoSave.status).to.eql('Producto no encontrado.');
        })
    });

    describe('GET un producto del carrito', () => {
      it('debería retornar el producto del carrito', async () => {
          
          //carritosCargados[0].id
          let response = await request.get(`/api/carrito/listar/${carritosCargados[0].id}`).set('Authorization',`bearer ${token}`);
          const productoSave = response.body;
          expect(response.status).to.eql(200);
          expect(productoSave).to.include.keys('price','name','thumbail','code','description','title','stock');
          expect(productoSave.description).to.eql(carritosCargados[0].description)
          expect(productoSave.code).to.eql(carritosCargados[0].code)
          expect(productoSave.stock).to.eql(carritosCargados[0].stock)
          expect(productoSave.title).to.eql(carritosCargados[0].title)
          expect(productoSave.price).to.eql(carritosCargados[0].price)
          expect(productoSave.thumbail).to.eql(carritosCargados[0].thumbail)
          expect(productoSave.name).to.eql(carritosCargados[0].name);
      });
    })

    describe('GET un producto del carrito que no existe', () => {
        it('No debería retornar el producto del carrito', async () => {  
            
            let response = await request.get(`/api/carrito/listar/dadadadaasa`).set('Authorization',`bearer ${token}`);
            const productoSave = response.body;
            expect(response.status).to.eql(404);
            expect(productoSave).to.include.keys('status');
            expect(productoSave.status).to.eql('Producto no encontrado.');
        });
      });


      describe('Delete un producto del carrito', () => {
        it('debería eliminar un producto del carrito', async () => {
            let response = await request.delete(`/api/carrito/borrar/${carritosCargados[0].id}`).set('Authorization',`bearer ${token}`).send();
            const productoSave = response.body;
            expect(response.status).to.eql(200);
            expect(productoSave).to.include.keys('price','name','thumbail','code','description','title','stock');
            expect(productoSave.description).to.eql(carritosCargados[0].description)
            expect(productoSave.code).to.eql(carritosCargados[0].code)
            expect(productoSave.stock).to.eql(carritosCargados[0].stock)
            expect(productoSave.title).to.eql(carritosCargados[0].title)
            expect(productoSave.price).to.eql(carritosCargados[0].price)
            expect(productoSave.thumbail).to.eql(carritosCargados[0].thumbail)
            expect(productoSave.name).to.eql(carritosCargados[0].name);
        });
      })

      describe('Delete un producto II del carrito', () => {
        it('debería eliminar el 2º producto del carrito', async () => {
            let response = await request.delete(`/api/carrito/borrar/${carritosCargados[1].id}`).set('Authorization',`bearer ${token}`).send();
            const productoSave = response.body;
            expect(response.status).to.eql(200);
            expect(productoSave).to.include.keys('price','name','thumbail','code','description','title','stock');
            expect(productoSave.description).to.eql(carritosCargados[1].description)
            expect(productoSave.code).to.eql(carritosCargados[1].code)
            expect(productoSave.stock).to.eql(carritosCargados[1].stock)
            expect(productoSave.title).to.eql(carritosCargados[1].title)
            expect(productoSave.price).to.eql(carritosCargados[1].price)
            expect(productoSave.thumbail).to.eql(carritosCargados[1].thumbail)
            expect(productoSave.name).to.eql(carritosCargados[1].name);
        });
      });

      describe('No Delete un producto del carrito', () => {
        it('No debería eliminar el producto del carrito', async () => {
            let response = await request.delete(`/api/carrito/borrar/${carritosCargados[1].id}`).set('Authorization',`bearer ${token}`).send();
            const productoSave = response.body;
            expect(response.status).to.eql(404);
            expect(productoSave).to.include.keys('status');
            expect(productoSave.status).to.eql('Producto no encontrado.')
        });
      })

      describe('Realizar la compra', () => {
        it('Debería realizar la compra del carrito', async () => {
            let response = await request.post(`/api/carrito/realizarpedido`).set('Authorization',`bearer ${token}`).send();
            const productoSave = response.body;
            expect(response.status).to.eql(200);
            expect(productoSave).to.include.keys('SUCCESS','fail');
            expect(productoSave.SUCCESS).to.eql('Order incomming...');
        });
      })
  


});