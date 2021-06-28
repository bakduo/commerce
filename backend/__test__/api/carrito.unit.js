let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../src/server');

let should = chai.should(); //Necesario para control de response

const { assert, expect } = require('chai');
chai.use(chaiHttp);

//Config app
const config = require('../../src/config/index');
const Producto = require('../../src/model/producto');
const ProductoRepository = require('../../src/repository/producto-repository');
const pr = new ProductoRepository(config.db);

describe('API Carritos', () => {
  //Load datastore memory
  beforeEach(loadResourceTest);
  //Clean datastore memory
  afterEach(cleanData);

  describe('POST /api/carrito/agregar ', () => {
    it('it should POST a product', (done) => {
      chai
        .request(server)
        .post('/api/carrito/agregar/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title').eql('Calculadora');
          res.body.should.have.property('price').eql(234.56);
          res.body.should.have.property('code').eql(112);
          res.body.should.have.property('name').eql('B');
          res.body.should.have.property('description').eql('sample2');
          res.body.should.have.property('stock').eql(11);
          res.body.should.have
            .property('thumbail')
            .eql(
              'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png'
            );
          done();
        });
    });
  });

  describe('GET /api/carrito/listar ', () => {
    it('it should list all producs into cart', (done) => {
      chai
        .request(server)
        .get('/api/carrito/listar')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(1);
          done();
        });
    });
  });

  describe('GET /api/carrito/listar/:id ', () => {
    const sessionTmp = config.id;
    it('it should list a product into the cart', (done) => {
      chai
        .request(server)
        .get('/api/carrito/listar/' + sessionTmp + '?name=B')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.be.a('object').property('producto');
          res.body.producto.should.have.property('title').eql('Calculadora');
          res.body.producto.should.have
            .property('thumbail')
            .eql(
              'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png'
            );
          res.body.producto.should.have.property('name').eql('B');
          res.body.producto.should.have.property('stock').eql(11);
          res.body.producto.should.have.property('code').eql(112);
          res.body.producto.should.have.property('id').eql(1);
          res.body.producto.should.have.property('description').eql('sample2');
          done();
        });
    });
  });

  describe('DELETE /api/carrito/borrar:1 ', () => {
    it('it should a delete a producto of cart', (done) => {
      chai
        .request(server)
        .delete('/api/carrito/borrar/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('producto').eql('1');
          done();
        });
    });
  });

  function loadResourceTest() {
    //Load 3 productos para testing

    const loadData = async () => {
      const p1 = new Producto();
      p1.setPrice(123.45);
      p1.setName('A');
      p1.setDescription('sample1');
      p1.setStock(10);
      p1.setCode(111);
      p1.setThumbail(
        'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png'
      );
      p1.setTitle('Escuadra');
      p1.setId(0);
      await pr.save(p1);

      const p2 = new Producto();
      p2.setName('B');
      p2.setDescription('sample2');
      p2.setStock(11);
      p2.setCode(112);
      p2.setPrice(234.56);
      p2.setThumbail(
        'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png'
      );
      p2.setTitle('Calculadora');
      p2.setId(1);
      await pr.save(p2);

      const p3 = new Producto();
      p3.setPrice(345.67);
      p3.setName('C');
      p3.setDescription('sample3');
      p3.setStock(12);
      p3.setCode(113);
      p3.setThumbail(
        'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png'
      );
      p3.setTitle('Globo Terráqueo');
      p3.setId(2);
      await pr.save(p3);
    };

    loadData();
  }

  function cleanData() {
    const remove = async () => {
      await pr.clear();
    };
    remove();
  }
});
