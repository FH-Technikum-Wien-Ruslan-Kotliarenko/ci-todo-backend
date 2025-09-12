const request = require('supertest');
const { build } = require('./helpers/app');

let app;

beforeAll(async () => {
  app = await build();
});
afterAll(async () => {
  await app.db.close();
  await app.close();
});

test('GET /health -> 200 ok:true', async () => {
  const res = await request(app.server).get('/health');
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ ok: true });
});
