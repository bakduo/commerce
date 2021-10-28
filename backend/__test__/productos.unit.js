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
let productoPost = undefined;
let token = '';

describe('Test productos UNIT',() => {
    
    before(async function(){
        console.log("###############BEGIN TEST#################");
        repoCarrito.deleteAll();
        repo.deleteAll();
        repoUser.deleteAll();
        repoCredential.deleteAll();

        productosFake = testRecords.load();
        user = testUserRecords.getOneAdmin();
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
        repoCarrito.deleteAll();
        repo.deleteAll();
        repoUser.deleteAll();
        repoCredential.deleteAll();
    })

    //Load datastore
    beforeEach(async () => {
        const load = async () => {
            productosFake.forEach(async (item)=>{
                const valor = await repo.save(item);
                console.log(valor);
            })
        }
        
        await load();
        
    });

    //Clean datastore
    afterEach(async () => {
        const clear = async () =>{
            // productosFake.forEach(async (item)=>{
            //     const p = await repo.find({query: {'key':'name','value':item.name}});
            //     if (p){
            //         const borrado = await repo.deleteById(p.id);
            //     }
            // })
            repo.deleteAll();
        }
        await clear();
    });
 
    describe('GET productos', () => {
        it('debería retornar lista de productos', async () => {
            
            let response = await request.get('/api/productos/listar')
            expect(response.status).to.eql(200);
            const productos = response.body;
            expect(productos).to.be.a('array');
            expect(productos).length.greaterThanOrEqual(5);
        });
    })

    // describe('POST producto', () => {
    //     it('debería incorporar un producto', async () => {
    //         productoPost = testRecords.getOne();
    //         let response = await request.post('/api/productos/guardar').set('Authorization',`bearer ${token}`).send(productoPost)
    //         expect(response.status).to.eql(201);
    //         const productoSave = response.body;
    //         expect(productoSave).to.include.keys('price','name','thumbail','code','description','title','stock');
    //         expect(productoSave.description).to.eql(productoPost.description)
    //         expect(productoSave.code).to.eql(productoPost.code)
    //         expect(productoSave.stock).to.eql(productoPost.stock)
    //         expect(productoSave.title).to.eql(productoPost.title)
    //         expect(productoSave.price).to.eql(productoPost.price)
    //         expect(productoSave.thumbail).to.eql(productoPost.thumbail)
    //         expect(productoSave.name).to.eql(productoPost.name);
    //     })
    // })

    // describe('POST producto repetido', () => {
    //     it('No debería incorporar un producto', async () => { 
    //         let response = await request.post('/api/productos/guardar').set('Authorization',`bearer ${token}`).send(productoPost)
    //         const productoSave = response.body;
    //         expect(response.status).to.eql(208);
    //         expect(productoSave).to.include.keys('status');
    //         expect(productoSave.status).to.eql("Producto ya existe.");
    //     })
    // })

    // describe('POST producto con error', () => {
    //     it('No debería incorporar un producto', async () => { 
            
    //         const productoFake = {
    //             name: 'A',
    //             stock: 111,
    //             description:'ffdsfs',
    //         };

    //         let response = await request.post('/api/productos/guardar').set('Authorization',`bearer ${token}`).send(productoFake)
    //         const productoSave = response.body;
    //         expect(response.status).to.eql(500);
    //         expect(productoSave).to.include.keys('status');
    //     })
    // })

    // describe('Update producto', () => {
    //     it('debería actualizar un producto', async () => {
    //         const p = await repo.find({query: {'key':'code','value':productoPost.code}});
    //         productoPost.name = 'update';
    //         productoPost.price= 22222;
    //         productoPost.stock= 1;
    //         let response = await request.put(`/api/productos/actualizar/${p.id}`).set('Authorization',`bearer ${token}`).send(productoPost);
    //         expect(response.status).to.eql(200)
    //         const productoSave = response.body;
    //         expect(productoSave).to.include.keys('price','name','thumbail','code','description','title','stock')
    //         expect(productoSave.description).to.eql(productoPost.description)
    //         expect(productoSave.code).to.eql(productoPost.code)
    //         expect(productoSave.title).to.eql(productoPost.title)
    //         expect(productoSave.price).to.eql(productoPost.price)
    //         expect(productoSave.thumbail).to.eql(productoPost.thumbail)
    //         expect(productoSave.name).to.eql(productoPost.name);
    //         expect(productoSave.stock).to.eql(productoPost.stock);
    //     });
    // })

    // describe('Falla Update producto', () => {
    //     it('No debería actualizar un producto', async () => {
    //         let response = await request.put(`/api/productos/actualizar/zzzzz*$`).set('Authorization',`bearer ${token}`).send(productoPost);
    //         expect(response.status).to.eql(404);
    //         const productoSave = response.body;
    //         expect(productoSave).to.include.keys('status');
    //         expect(productoSave.status).to.eql("Producto no existe.");
    //     });
    // })

    // describe('Get producto by id', () => {
    //     it('debería obtener un producto por id', async () => {
    //         const p = productosFake[0];
    //         //const p = await repo.find({query: {'key':'name','value':productoPost.name}});
    //         let response = await request.get(`/api/productos/listar/${p.id}`).send();
    //         expect(response.status).to.eql(200)
    //         const productoSave=response.body
    //         expect(productoSave).to.include.keys('price','name','thumbail','code','description','title','stock');
    //         expect(productoSave.description).to.eql(p.description)
    //         expect(productoSave.code).to.eql(p.code)
    //         expect(productoSave.stock).to.eql(p.stock)
    //         expect(productoSave.title).to.eql(p.title)
    //         expect(productoSave.price).to.eql(p.price)
    //         expect(productoSave.thumbail).to.eql(p.thumbail)
    //         expect(productoSave.name).to.eql(p.name);
    //     });
    // })

    // describe('Delete producto', () => {
    //     it('debería eliminar un producto', async () => {
    //         const p = await repo.find({query: {'key':'name','value':productoPost.name}});
    //         let response = await request.delete(`/api/productos/borrar/${p.id}`).set('Authorization',`bearer ${token}`).send();
    //         expect(response.status).to.eql(200);
    //         const productoDelete= response.body;
    //         expect(productoDelete).to.include.keys('price','name','thumbail','code','description','title')
    //         expect(productoDelete.title).to.eql(productoPost.title)
    //         expect(productoDelete.name).to.eql(productoPost.name)
    //         expect(productoDelete.code).to.eql(productoPost.code)
    //         expect(productoDelete.price).to.eql(productoPost.price)
    //         expect(productoDelete.thumbail).to.eql(productoPost.thumbail)
    //         expect(productoDelete.description).to.eql(productoPost.description);
    //     });
    // })

    // describe('Falla Delete producto', () => {
    //     it('No debería eliminar un producto', async () => {
    //         const p = await repo.find({query: {'key':'name','value':productoPost.name}});
    //         let response = await request.delete(`/api/productos/borrar/zzzaaaa11111`).set('Authorization',`bearer ${token}`).send();
    //         expect(response.status).to.eql(404);
    //         const productoDelete= response.body;
    //         expect(productoDelete).to.include.keys('status')
    //         expect(productoDelete.status).to.eql('Producto no encontrado para eliminar');
    //     });
    // })

});