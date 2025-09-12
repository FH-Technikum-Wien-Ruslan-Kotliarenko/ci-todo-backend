const request = require('supertest');
const { build } = require('./helpers/app');
const seedKey = require('./helpers/seedKey');
const { truncateAll } = require('./helpers/dbUtils');

let app, KEY, ApiKey;

beforeAll(async () => {
  app = await build();
  ApiKey = app.db.models.ApiKey;
});
afterAll(async () => {
  await app.db.close();
  await app.close();
});
beforeEach(async () => {
  await truncateAll(app);
  KEY = await seedKey(app);
});

test('POST /apikeys/rotate -> returns new key and revokes old', async () => {
  const rot = await request(app.server).post('/apikeys/rotate').set('x-api-key', KEY);
  expect(rot.status).toBe(201);
  expect(rot.body.apiKey).toBeDefined();
  const NEW = rot.body.apiKey;

  // old should fail
  const r1 = await request(app.server)
    .post('/items')
    .set('x-api-key', KEY)
    .send({ name: 'should-fail' });
  expect(r1.status).toBe(401);

  // new should succeed
  const r2 = await request(app.server).post('/items').set('x-api-key', NEW).send({ name: 'ok' });
  expect(r2.status).toBe(201);

  // db assert: old has revokedAt
  const all = await ApiKey.findAll({ order: [['id', 'ASC']] });
  expect(all.length).toBe(2);
  expect(all[0].revokedAt).not.toBeNull();
  expect(all[1].revokedAt).toBeNull();
});
