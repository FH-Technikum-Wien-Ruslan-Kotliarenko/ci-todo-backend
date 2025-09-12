require('dotenv').config({ path: '.env' });

const build = async () => {
  const fastify = require('fastify')({ logger: true });

  // bring in the same objects your server registers
  const db = require('../../src/db');
  fastify.decorate('db', db);
  fastify.decorate('isSearchEnabled', async () => true);

  // sync fresh schema for each suite
  await db.sync({ force: true });

  fastify.register(require('../../src/plugins/apiKeyAuth'));
  fastify.register(require('../../src/routes/health'));
  fastify.register(require('../../src/routes/items'));
  fastify.register(require('../../src/routes/apikeys'));

  await fastify.ready();
  return fastify;
};

module.exports = { build };
