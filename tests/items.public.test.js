const request = require('supertest');
const { build } = require('./helpers/app');
const { truncateAll } = require('./helpers/dbUtils');

let app, Item;

beforeAll(async () => {
  app = await build();
  Item = app.db.models.Item;
});
afterAll(async () => {
  await app.db.close();
  await app.close();
});
beforeEach(async () => {
  await truncateAll(app);
});

test('GET /items -> empty list with meta', async () => {
  const res = await request(app.server).get('/items');
  expect(res.status).toBe(200);
  expect(res.body.data).toEqual([]);
  expect(res.body.meta).toMatchObject({ page: 1 });
});

test('GET /items pagination -> pageSize & total', async () => {
  const bulk = Array.from({ length: 25 }, (_, i) => ({ name: `i${i + 1}` }));
  await Item.bulkCreate(bulk);

  const res = await request(app.server).get('/items?page=2&pageSize=10');
  expect(res.status).toBe(200);
  expect(res.body.data.length).toBe(10);
  expect(res.body.meta.total).toBe(25);
  expect(res.body.meta.page).toBe(2);
  expect(res.body.meta.pages).toBe(3);
});

test('GET /items sort -> oldest first when sort=oldest', async () => {
  const a = await Item.create({ name: 'A', createdAt: new Date(Date.now() - 60000) });
  const b = await Item.create({ name: 'B', createdAt: new Date() });

  const res = await request(app.server).get('/items?sort=oldest');
  expect(res.status).toBe(200);
  expect(res.body.data[0].id).toBe(a.id);
});
