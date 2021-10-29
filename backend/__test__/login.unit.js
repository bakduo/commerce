const config = require('../src/config/index');
config.server.dbtype = "mongo";
config.rebuild();
const app = require('../src/app');
const request = require('supertest')(app);
const { expect } = require('chai');
const testRecords = require('./fixtures/loaderuserfake');
const UserDAO = require('../src/dao/user-dao');
const repoUser = new UserDAO(config.db);

let user;

describe('Test Login UNIT',() => {
    
    before(function(){
        console.log("###############BEGIN TEST#################");
        user = testRecords.getOneAdmin();
    })

    after(async () => {
        await repoUser.deleteAll();
        console.log("###############CLEAR DB TEST#################");
    })

    describe('Singup user', () => {
        it('debería generar un usuario', async () => {    
            let response = await request.post('/api/signup').send(user);
            expect(response.status).to.eql(200);
            const responseUser = response.body;
            expect(responseUser).to.be.a('object');
            expect(responseUser).to.include.keys('SUCCESS','fail');
            expect(responseUser.fail).to.eql(false);
            
        });
    });

    describe('Singup repetido user', () => {
      it('No debería generar un usuario', async () => {    
          let response = await request.post('/api/signup').send(user);
          expect(response.status).to.eql(200);
          const responseUser = response.body;
          expect(responseUser).to.be.a('object');
          expect(responseUser).to.include.keys('SUCCESS','fail');
          expect(responseUser.fail).to.eql('Usuario ya existe.');
          
      });
    });

    describe('Login User', () => {
      it('Debería generar token', async () => {    
          const loginuser = {
            email:user.email,
            password:user.password
          }
          let response = await request.post('/api/login').send(loginuser);
          expect(response.status).to.eql(200);
          const responseUser = response.body;
          expect(responseUser).to.be.a('object');
          expect(responseUser).to.include.keys('SUCCESS','fail','token');
          expect(responseUser.SUCCESS).to.eql(true);
          expect(responseUser.token).to.be.a('string');
          
      });
    })

    describe('Fail Login User', () => {
      it('Denegar generar token', async () => {    
          const loginuser = {
            email:user.email,
            password:'pepito'
          }
          let response = await request.post('/api/login').send(loginuser);
          expect(response.status).to.eql(401);
          const responseUser = response.body;
          expect(responseUser).to.be.a('object');
          expect(responseUser).to.include.keys('SUCCESS','fail');
          expect(responseUser.SUCCESS).to.eql(false);
          expect(responseUser.fail).to.eql('usuario o password invalida');
      });
    });


    describe('Logout user', () => {
      it('Realizar logout', async () => {    
          
          let response = await request.post('/api/logout').send();
          expect(response.status).to.eql(200);
          const responseUser = response.body;
          expect(responseUser).to.be.a('object');
          expect(responseUser).to.include.keys('SUCCESS','fail');
          expect(responseUser.SUCCESS).to.eql(true);
          expect(responseUser.fail).to.eql(false);
      });
    });

});
