require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const sequelize = require('./db');

// attach db
fastify.decorate('db', sequelize);

// plugins
fastify.register(require('./plugins/apiKeyAuth'));
fastify.register(require('./plugins/posthog'));

// routes
fastify.register(require('./routes/health'));
fastify.register(require('./routes/items'));
fastify.register(require('./routes/apikeys'));

// bootstrap
async function start() {
  try {
    // Create tables if missing (simple: no migrations)
    await fastify.db.sync();

    // Seed an initial API key if none exists
    const { ApiKey } = fastify.db.models;
    const count = await ApiKey.count({ where: { revokedAt: null } });
    if (count === 0) {
      const crypto = require('crypto');
      const bcrypt = require('bcrypt');
      const plaintext = crypto.randomBytes(24).toString('hex');
      const hash = await bcrypt.hash(plaintext, 10);
      await ApiKey.create({ hash });
      fastify.log.warn(`Initial API key (store safely, shown once): ${plaintext}`);
    }

    const port = Number(process.env.PORT || 8080);
    const host = process.env.HOST || '0.0.0.0';
    await fastify.listen({ port, host });
    fastify.log.info(`API listening on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
