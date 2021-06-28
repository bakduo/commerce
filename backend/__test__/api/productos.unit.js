let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../src/server');

let should = chai.should(); //Necesario para control de response

const Producto = require('../../src/model/producto');
const { assert, expect } = require('chai');
const ProductoRepository = require('../../src/repository/producto-repository');
chai.use(chaiHttp);

//Config app
const config = require('../../src/config/index');

const pr = new ProductoRepository(config.db);

describe('API Productos', () => {
  //Load datastore memory
  beforeEach(loadResourceTest);

  //Clean datastore memory
  afterEach(cleanData);

  describe('POST /api/productos/guardar ', () => {
    it('it should POST a product', (done) => {
      let producto = {
        title: 'producto1',
        price: 1111,
        name: 'sample1',
        code: 222,
        stock: 10,
        description: 'desc 1',
        thumbail:
          'https://finderding.com/wp-content/uploads/2017/09/penguin-8639_1280.png',
      };

      chai
        .request(server)
        .post('/api/productos/guardar')
        .set('x-api-custom', true)
        .send(producto)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title').eql('producto1');
          res.body.should.have.property('price').eql(1111);
          res.body.should.have.property('code').eql(222);
          res.body.should.have.property('name').eql('sample1');
          res.body.should.have.property('description').eql('desc 1');
          res.body.should.have.property('stock').eql(10);
          res.body.should.have
            .property('thumbail')
            .eql(
              'https://finderding.com/wp-content/uploads/2017/09/penguin-8639_1280.png'
            );
          done();
        });
    });

    it('it should not POST a product without price field', (done) => {
      let producto = {
        title: 'producto1',
        thumbail:
          'https://finderding.com/wp-content/uploads/2017/09/penguin-8639_1280.png',
      };

      chai
        .request(server)
        .post('/api/productos/guardar')
        .set('x-api-custom', true)
        .send(producto)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(false);
          res.body.should.have.property('type').eql('Invalid');
          res.body.should.have.property('value').eql('Parameter inmcomplete');
          //res.body.status.should.have.property('kind').eql('Required: price');
          done();
        });
    });

    it('it should not POST a product without invalid parameter field', (done) => {
      let producto = {
        title: 'Producto2',
        price: 'no deberia funcionar',
        thumbail:
          'https://finderding.com/wp-content/uploads/2017/09/penguin-8639_1280.png',
      };

      chai
        .request(server)
        .post('/api/productos/guardar')
        .set('x-api-custom', true)
        .send(producto)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(false);
          res.body.should.have.property('type').eql('Invalid');
          res.body.should.have.property('value').eql('Parameter inmcomplete');
          done();
        });
    });

    it('it should not POST a product without title field', (done) => {
      let producto = {
        price: 11,
        thumbail:
          'https://finderding.com/wp-content/uploads/2017/09/penguin-8639_1280.png',
      };
      chai
        .request(server)
        .post('/api/productos/guardar')
        .set('x-api-custom', true)
        .send(producto)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql(false);
          res.body.should.have.property('type').eql('Invalid');
          res.body.should.have.property('value').eql('Parameter inmcomplete');
          done();
        });
    });
  });

  describe('GET /api/productos/listar', () => {
    it('it should GET all the productos', (done) => {
      chai
        .request(server)
        .get('/api/productos/listar')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(3);
          done();
        });
    });

    it('it should GET a product by the given id', (done) => {
      chai
        .request(server)
        .get('/api/productos/listar/1')

        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title').eql('Calculadora');
          res.body.should.have.property('price').eql(234.56);
          res.body.should.have
            .property('thumbail')
            .eql(
              'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png'
            );
          res.body.should.have.property('id').eql(1);
          done();
        });
    });

    it('it should not GET a product by the given id', (done) => {
      chai
        .request(server)
        .get('/api/productos/listar/1100')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('Producto not found.');
          done();
        });
    });
  });

  describe('Admin PUT /api/productos/actualizar/:id producto', () => {
    it('it should UPDATE a product given the id', (done) => {
      chai
        .request(server)
        .put('/api/productos/actualizar/1')
        .set('x-api-custom', true)
        .send({
          title: 'Cambio1',
          price: 111,
          name: 'otro nombre',
          code: 10,
          description: '',
          stock: 2,
          thumbail:
            'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title').eql('Cambio1');
          res.body.should.have.property('price').eql(111);
          res.body.should.have.property('code').eql(10);
          res.body.should.have.property('name').eql('otro nombre');
          res.body.should.have.property('description').eql('');
          res.body.should.have.property('stock').eql(2);
          res.body.should.have
            .property('thumbail')
            .eql(
              'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png'
            );
          res.body.should.have.property('id').eql(1);
          done();
        });
    });
  });

  describe('USER PUT /api/productos/actualizar/:id producto', () => {
    it('it should not UPDATE a product given the id', (done) => {
      chai
        .request(server)
        .put('/api/productos/actualizar/1')
        .send({
          title: 'Cambio1',
          price: 111,
          name: 'otro nombre',
          code: 111,
          description: '',
          stock: 2,
          thumbail:
            'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png',
        })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Forbidden');
          done();
        });
    });
  });

  describe('Admin Delete /api/productos/borrar/:id producto', () => {
    it('it should DELETE a product given the id', (done) => {
      chai
        .request(server)
        .delete('/api/productos/borrar/2')
        .set('x-api-custom', true)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title').eql('Globo Terráqueo');
          res.body.should.have.property('price').eql(345.67);
          res.body.should.have
            .property('thumbail')
            .eql(
              'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png'
            );
          res.body.should.have.property('id').eql(2);
          done();
        });
    });
  });

  describe('User Delete /api/productos/borrar/:id producto', () => {
    it('it should not DELETE a product given the id', (done) => {
      chai
        .request(server)
        .delete('/api/productos/borrar/2')
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Forbidden');
          done();
        });
    });
  });

  function loadResourceTest() {
    //Load 3 productos para testing

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
    pr.save(p1);

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
    pr.save(p2);

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
    pr.save(p3);
  }

  function cleanData() {
    pr.clear();
  }
});
