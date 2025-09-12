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

test('search enabled -> filters by q', async () => {
  await Item.bulkCreate([
    { name: 'Black wallet', description: 'cash' },
    { name: 'Blue umbrella', description: 'rain' }
  ]);

  const res = await request(app.server).get('/items?q=wallet');
  expect(res.status).toBe(200);
  expect(res.body.data.length).toBe(1);
  expect(res.body.data[0].name).toMatch(/wallet/i);
});
