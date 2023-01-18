const request = require('supertest');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000/api';
const buyerUsername = 'some-user-name' + Math.random();
const sellerUsernameA = 'some-seller-user-name' + Math.random();
const sellerUsernameB = 'some-seller-user-name' + Math.random();
const adminUsername = 'admin';
let buyerToken = '';
let sellerAToken = '';
let sellerBToken = '';
let adminToken = '';
const password = '123456';
const adminPassword = 'password';

let productA_Id = 0;
let productB_Id = 0;
let productC_Id = 0;

describe('Admin login', function() {
  it('successfully login as admin', (done) => {
    request(BASE_URL)
      .post('/login')
      .send({
        'username': adminUsername,
        'password': adminPassword,
      })
      .set('Content-Type', 'application/json')
      .expect(200)
      .end((e, r) => {
        assert.equal(r.body.user.username, adminUsername);
        adminToken = r.body.access_token;
        done();
      });
  });
});

describe('Creating user', function() {
  it('fails with validation', (done) => {
    request(BASE_URL)
      .post('/users')
      .send({
        'firstName': 'A',
        'lastName': 'B',
        'username': 'some-user-name',
        'email': 'some-email@example.com',
        'password': password,
        'role': 'buyer',
      })
      .set('Content-Type', 'application/json')
      .expect(400, done);
  });

  it('creates buyer', (done) => {
    request(BASE_URL)
      .post('/users')
      .send({
        'firstName': 'SomeFirstName',
        'lastName': 'SomeLastname',
        'username': buyerUsername,
        'email': `some-email${Math.random()}@example.com`,
        'password': password,
        'role': 'buyer',
      })
      .set('Content-Type', 'application/json')
      .expect(201, done);
  });


  it('creates seller A ', (done) => {
    request(BASE_URL)
      .post('/users')
      .send({
        'firstName': 'SomeFirstName',
        'lastName': 'SomeLastname',
        'username': sellerUsernameA,
        'email': `some-email${Math.random()}@example.com`,
        'password': password,
        'role': 'seller',
      })
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(201)
      .end((e, r) => {
        assert.equal(r.body.role, 'seller');
        done();
      });
  });

  it('creates seller B ', (done) => {
    request(BASE_URL)
      .post('/users')
      .send({
        'firstName': 'SomeFirstName',
        'lastName': 'SomeLastname',
        'username': sellerUsernameB,
        'email': `some-email${Math.random()}@example.com`,
        'password': password,
        'role': 'seller',
      })
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(201)
      .end((e, r) => {
        assert.equal(r.body.role, 'seller');
        done();
      });
  });

  it('fails with duplication buyer', (done) => {
    request(BASE_URL)
      .post('/users')
      .send({
        'firstName': 'SomeFirstName',
        'lastName': 'SomeLastname',
        'username': buyerUsername,
        'email': `some-email${Math.random()}@example.com`,
        'password': password,
        'role': 'buyer',
      })
      .set('Content-Type', 'application/json')
      .expect(500, done);
  });

  it('try to assign seller role', (done) => {
    request(BASE_URL)
      .post('/users')
      .send({
        'firstName': 'SomeFirstName',
        'lastName': 'SomeLastname',
        'username': buyerUsername + Math.random().toString(),
        'email': `some-email${Math.random()}@example.com`,
        'password': password,
        'role': 'seller',
      })
      .set('Content-Type', 'application/json')
      .expect(201)
      .end((err, resp) => {
        assert.equal(resp.body.role, 'buyer');
        done();
      });
  });

  it('try to assign admin role', (done) => {
    request(BASE_URL)
      .post('/users')
      .send({
        'firstName': 'SomeFirstName',
        'lastName': 'SomeLastname',
        'username': buyerUsername + Math.random().toString(),
        'email': `some-email${Math.random()}@example.com`,
        'password': password,
        'role': 'admin',
      })
      .set('Content-Type', 'application/json')
      .expect(201)
      .end((err, resp) => {
        assert.equal(resp.body.role, 'buyer');
        done();
      });
  });
});

describe('Login', function() {
  it('fails to auth with wrong username', (done) => {
    request(BASE_URL)
      .post('/login')
      .send({
        'username': 'wrong-user-name',
        'password': password,
      })
      .set('Content-Type', 'application/json')
      .expect(401, done);
  });

  it('fails to auth with wrong password', (done) => {
    request(BASE_URL)
      .post('/login')
      .send({
        'username': buyerUsername,
        'password': 'wrong-password',
      })
      .set('Content-Type', 'application/json')
      .expect(401, done);
  });

  it('successfully login as buyer', (done) => {
    request(BASE_URL)
      .post('/login')
      .send({
        'username': buyerUsername,
        'password': password,
      })
      .set('Content-Type', 'application/json')
      .expect(200)
      .end((e, r) => {
        assert.equal(r.body.user.username, buyerUsername);
        buyerToken = r.body.access_token;
        done();
      });
  });

  it('successfully login as seller', (done) => {
    request(BASE_URL)
      .post('/login')
      .send({
        'username': sellerUsernameA,
        'password': password,
      })
      .set('Content-Type', 'application/json')
      .expect(200)
      .end((e, r) => {
        assert.equal(r.body.user.username, sellerUsernameA);
        sellerAToken = r.body.access_token;
        done();
      });
  });
});

describe('Products', function() {
  it('fails to create some product as buyer', (done) => {
    request(BASE_URL)
      .post('/products')
      .send({
        'productName': 'Product A',
        'cost': 10,
        'amountAvailable': 10,
      })
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${buyerToken}`)
      .expect(403, done);
  });

  it('succeed to create some Product A as seller A', (done) => {
    request(BASE_URL)
      .post('/products')
      .send({
        'productName': 'Product A',
        'cost': 10,
        'amountAvailable': 10,
      })
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${sellerAToken}`)
      .expect(201)
      .end((e, r) => {
        assert.equal(r.body.productName, 'Product A');
        productA_Id = r.body.id;
        done();
      });
  });

  it('succeed to create some Product B as seller A', (done) => {
    request(BASE_URL)
      .post('/products')
      .send({
        'productName': 'Product B',
        'cost': 10,
        'amountAvailable': 10,
      })
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${sellerAToken}`)
      .expect(201)
      .end((e, r) => {
        assert.equal(r.body.productName, 'Product B');
        productB_Id = r.body.id;
        done();
      });
  });

  it('fails to create some Product C as seller A with price not dividable by 5', (done) => {
    request(BASE_URL)
      .post('/products')
      .send({
        'productName': 'Product C',
        'cost': 101,
        'amountAvailable': 10,
      })
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${sellerAToken}`)
      .expect(400, done);
  });

  it('fails to create some Product C as seller A with negative price', (done) => {
    request(BASE_URL)
      .post('/products')
      .send({
        'productName': 'Product C',
        'cost': -101,
        'amountAvailable': 10,
      })
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${sellerAToken}`)
      .expect(400, done);
  });

  it('fails to create some Product C as seller A with negative amount', (done) => {
    request(BASE_URL)
      .post('/products')
      .send({
        'productName': 'Product C',
        'cost': 100,
        'amountAvailable': -10,
      })
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${sellerAToken}`)
      .expect(400, done);
  });

  it('succeed to create some Product C as seller A', (done) => {
    request(BASE_URL)
      .post('/products')
      .send({
        'productName': 'Product C',
        'cost': 70,
        'amountAvailable': 2,
      })
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${sellerAToken}`)
      .expect(201)
      .end((e, r) => {
        assert.equal(r.body.productName, 'Product C');
        productC_Id = r.body.id;
        done();
      });
  });

  it('get all products and Product A is exist', (done) => {
    request(BASE_URL)
      .get('/products')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${sellerAToken}`)
      .expect(200)
      .end((e, r) => {
        assert.equal(r.body.filter(p => p.id == productA_Id).length, 1);
        done();
      });
  });

  it('request Product A', (done) => {
    request(BASE_URL)
      .get('/products/' + productA_Id)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${sellerAToken}`)
      .expect(200)
      .end((e, r) => {
        assert.equal(r.body.id, productA_Id);
        done();
      });
  });

  it('update Product A', (done) => {
    request(BASE_URL)
      .put('/products/' + productA_Id)
      .send({
        'productName': 'Product A1',
      })
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${sellerAToken}`)
      .expect(200)
      .end((e, r) => {
        assert.equal(r.body.productName, 'Product A1');
        done();
      });
  });

  it('try to update Product A as another Seller', (done) => {
    request(BASE_URL)
      .put('/products/' + productA_Id)
      .send({
        'productName': 'Product A2',
      })
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${sellerBToken}`)
      .expect(403, done);
  });

  it('delete Product A', (done) => {
    request(BASE_URL)
      .delete('/products/' + productA_Id)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${sellerAToken}`)
      .expect(204, done);
  });
});


describe('Vending', function() {
  it('try to deposit wrong coin', (done) => {
    request(BASE_URL)
      .post('/deposit')
      .send({
        'coin': 200,
      })
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${buyerToken}`)
      .expect(400, done);
  });


  it('deposit 100c', (done) => {
    request(BASE_URL)
      .post('/deposit')
      .send({
        'coin': 100,
      })
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${buyerToken}`)
      .expect(200)
      .end((e, r) => {
        assert.equal(r.body.balance, 100);
        done();
      });
  });

  it('deposit 20c', (done) => {
    request(BASE_URL)
      .post('/deposit')
      .send({
        'coin': 20,
      })
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${buyerToken}`)
      .expect(200)
      .end((e, r) => {
        assert.equal(r.body.balance, 120);
        done();
      });
  });

  it('reset', (done) => {
    request(BASE_URL)
      .get('/reset')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${buyerToken}`)
      .expect(200)
      .end((e, r) => {
        assert.equal(r.body.balance.join(','), '0,0,1,0,1');
        done();
      });
  });

});
