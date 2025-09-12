const request = require('supertest');
const { build } = require('./helpers/app');
const seedKey = require('./helpers/seedKey');
const { truncateAll } = require('./helpers/dbUtils');

let app, KEY, Item;

beforeAll(async () => {
  app = await build();
  KEY = await seedKey(app);
  Item = app.db.models.Item;
});
afterAll(async () => {
  await app.db.close();
  await app.close();
});
beforeEach(async () => {
  await truncateAll(app);
  KEY = await seedKey(app);
});

test('POST /items -> 201 Created', async () => {
  const res = await request(app.server)
    .post('/items')
    .set('x-api-key', KEY)
    .send({ name: 'Black wallet', description: 'near cafeteria' });
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
});

test('PUT /items/:id -> 200 updated', async () => {
  const created = await Item.create({ name: 'X', description: 'old' });
  const res = await request(app.server)
    .put(`/items/${created.id}`)
    .set('x-api-key', KEY)
    .send({ description: 'new' });
  expect(res.status).toBe(200);
  expect(res.body.description).toBe('new');
});

test('DELETE /items/:id -> 204', async () => {
  const created = await Item.create({ name: 'ToDelete' });
  const res = await request(app.server).delete(`/items/${created.id}`).set('x-api-key', KEY);
  expect(res.status).toBe(204);
  const found = await Item.findByPk(created.id);
  expect(found).toBeNull();
});

test('POST /items with invalid key -> 401', async () => {
  const res = await request(app.server)
    .post('/items')
    .set('x-api-key', 'WRONG')
    .send({ name: 'Blocked' });
  expect(res.status).toBe(401);
});
