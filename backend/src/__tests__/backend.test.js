const supertest = require('supertest');
const http = require('http');

const db = require('./db');
const app = require('../app');

let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll((done) => {
  server.close(done);
  db.shutdown();
});

const fake = {
  'email': 'fake@fakes.com',
  'password': 'fakemember',
};

const molly = {
  'email': 'molly@books.com',
  'password': 'mollymember',
};

const mollyfake = {
  'email': 'molly@books.com',
  'password': 'mollymembersasdasd',
};

test('GET Invalid URL', async () => {
  await request.get('/v0/so-not-a-real-end-point-ba-bip-de-doo-da/')
    .expect(404);
});

test('Invalid login test - Non-found user', async () => {
  await request.post('/v0/login')
    .send(fake)
    .expect(401);
});

test('Invalid login test - Wrong Password', async () => {
  await request.post('/v0/login')
    .send(mollyfake)
    .expect(401);
});

test('Valid login test', async () => {
  await request.post('/v0/login')
    .send(molly)
    .expect(200);
});

test('GET Mailbox without authorization - No authorization', async () => {
  await request.get('/v0/Mailbox?mailbox=Inbox')
    .expect(401);
});

test('GET Mailbox without authorization - Wrong authorization', async () => {
  await request.get('/v0/Mailbox?mailbox=Inbox')
    .set('authorization', 'Bearer a')
    .expect(403);
});

test('GET Mailbox without authorization - authorization no exist', async () => {
  await request.get('/v0/Mailbox?mailbox=Inbox')
    .set('authorization', 'a')
    .expect(401);
});

test('GET Mailbox with authorization - Inbox', async () => {
  let token = await request.post('/v0/login').send(molly);
  token = token.body.accessToken;
  await request.get('/v0/Mailbox?mailbox=Inbox')
    .set('authorization', 'Bearer '+token)
    .expect(200);
});

test('GET Mailbox with authorization - Trash', async () => {
  let token = await request.post('/v0/login').send(molly);
  token = token.body.accessToken;
  await request.get('/v0/Mailbox?mailbox=Trash')
    .set('authorization', 'Bearer '+token)
    .expect(200);
});

test('GET Mailbox with authorization - Fake mailbox', async () => {
  let token = await request.post('/v0/login').send(molly);
  token = token.body.accessToken;
  await request.get('/v0/Mailbox?mailbox=zxcvdfa34rtsdfvsddf')
    .set('authorization', 'Bearer '+token)
    .expect(400);
});

test('GET Mailbox without authorization - Fake mailbox', async () => {
  await request.get('/v0/Mailbox?mailbox=zxcvdfa34rtsdfvsddf')
    .expect(401);
});
