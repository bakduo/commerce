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
const OrdenDAO = require('../src/dao/orden-dao');

const repoUser = new UserDAO(config.db);
const repoOrden = new OrdenDAO(config.db);
const repoCredential = new CredentialDAO(config.db);
const repo = new ProductoDAO(config.db);
const repoCarrito = new CarritoDAO(config.db);
const testRecords = require('./fixtures/loaderfake');
const testUserRecords = require('./fixtures/loaderuserfake');

let productosFake = [];
let token = '';
let ordenCliente;


describe('Test Orden completa UNIT',() => {
    
    before(async function(){
        console.log("###############BEGIN TEST#################");
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
        productosFake = testRecords.load();
    });

    after(async () => {
        console.log("###############CLEAR DB TEST#################");
        await repoUser.deleteAll();
        await repoCredential.deleteAll();
        await repoCarrito.deleteAll();
        await repo.deleteAll();
        await repoOrden.deleteAll();
    })

    //Load datastore
    beforeEach(async () => {
        
    });

    //Clean datastore
    afterEach(async () => {
       
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
            const p = await repo.save(productosFake[0]);
            let response = await request.post(`/api/carrito/agregar/${p.getId()}`).set('Authorization',`bearer ${token}`).send();
            expect(response.status).to.eql(201);
            const productoSave = response.body;
            expect(productoSave).to.include.keys('price','name','thumbail','code','description','title','stock');
            expect(productoSave.description).to.eql(p.getDescription())
            expect(productoSave.code).to.eql(p.getCode())
            expect(productoSave.stock).to.eql(p.getStock())
            expect(productoSave.title).to.eql(p.getTitle())
            expect(productoSave.price).to.eql(p.getPrice())
            expect(productoSave.thumbail).to.eql(p.getThumbail())
            expect(productoSave.name).to.eql(p.getName());
        })
    })

    describe('POST producto al carrito II', () => {
      it('debería incorporar un producto', async () => {
          const p = await repo.save(productosFake[1]);
          let response = await request.post(`/api/carrito/agregar/${p.getId()}`).set('Authorization',`bearer ${token}`).send();
          expect(response.status).to.eql(201);
          const productoSave = response.body;
          expect(productoSave).to.include.keys('price','name','thumbail','code','description','title','stock');
          expect(productoSave.code).to.eql(p.getCode())
          expect(productoSave.stock).to.eql(p.getStock())
          expect(productoSave.title).to.eql(p.getTitle())
          expect(productoSave.price).to.eql(p.getPrice())
          expect(productoSave.thumbail).to.eql(p.getThumbail())
          expect(productoSave.name).to.eql(p.getName());
      })
  })

  describe('POST producto al carrito III', () => {
    it('debería incorporar un producto', async () => {        
        const p = await repo.save(productosFake[2]);
        let response = await request.post(`/api/carrito/agregar/${p.getId()}`).set('Authorization',`bearer ${token}`).send();
        expect(response.status).to.eql(201);
        const productoSave = response.body;
        expect(productoSave).to.include.keys('price','name','thumbail','code','description','title','stock');
        expect(productoSave.code).to.eql(p.getCode())
        expect(productoSave.stock).to.eql(p.getStock())
        expect(productoSave.title).to.eql(p.getTitle())
        expect(productoSave.price).to.eql(p.getPrice())
        expect(productoSave.thumbail).to.eql(p.getThumbail())
        expect(productoSave.name).to.eql(p.getName());
    })
  })

  describe('POST producto al carrito IV', () => {
    it('debería incorporar un producto', async () => {    
        const p = await repo.save(productosFake[3]);
        let response = await request.post(`/api/carrito/agregar/${p.getId()}`).set('Authorization',`bearer ${token}`).send();
        expect(response.status).to.eql(201);
        const productoSave = response.body;
        expect(productoSave).to.include.keys('price','name','thumbail','code','description','title','stock');
        expect(productoSave.code).to.eql(p.getCode())
        expect(productoSave.stock).to.eql(p.getStock())
        expect(productoSave.title).to.eql(p.getTitle())
        expect(productoSave.price).to.eql(p.getPrice())
        expect(productoSave.thumbail).to.eql(p.getThumbail())
        expect(productoSave.name).to.eql(p.getName());
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
  });

  describe('Realizar la orden', () => {
        it('Debería realizar la orden de compra del carrito', async () => {
            let response = await request.post(`/api/orden/realizarpedido`).set('Authorization',`bearer ${token}`).send();
            const productoSave = response.body;
            expect(response.status).to.eql(200);
            expect(productoSave).to.include.keys('status','fail','orden');
            expect(productoSave.orden).to.be.a('object');
        });
  });

  describe('Obtener todas las ordenes', () => {
    it('Debería tener todos las ordenes', async () => {
        let response = await request.get(`/api/orden/listar`).set('Authorization',`bearer ${token}`).send();
        const ordenSave = response.body;
        expect(response.status).to.eql(200);
        expect(ordenSave).to.be.a('array');
        expect(ordenSave).length.greaterThanOrEqual(1);
        expect(ordenSave[0]).to.include.keys('id','timestamp','email','estado','productos');
        ordenCliente = ordenSave[0];
    });
  });

  describe('Obtener una orden especifica por id', () => {
    it('Debería retornar una orden', async () => {
        let response = await request.get(`/api/orden/listar/${ordenCliente.id}`).set('Authorization',`bearer ${token}`).send();
        const ordenSave = response.body;
        expect(response.status).to.eql(200);
        expect(ordenSave).to.be.a('object');
    });
  });

  describe('Obtener las ordenes del user por mail', () => {
    it('Debería retornar las ordendes por medio del mail del user', async () => {
        let response = await request.post(`/api/orden/user/${ordenCliente.email}`).set('Authorization',`bearer ${token}`).send();
        const ordenSave = response.body;
        expect(response.status).to.eql(200);
        expect(ordenSave).to.be.a('object');
        expect(ordenSave).to.include.keys('status','fail','ordenes');
        expect(ordenSave.ordenes).to.be.a('array');
    });
  });

  describe('Obtener los productos del user', () => {
    it('Debería retornar los productos de la orden', async () => {
        let response = await request.post(`/api/orden/productos/${ordenCliente.id}`).set('Authorization',`bearer ${token}`).send();
        const ordenSave = response.body;
        expect(response.status).to.eql(200);
        expect(ordenSave).to.be.a('array');
    });
  });

});