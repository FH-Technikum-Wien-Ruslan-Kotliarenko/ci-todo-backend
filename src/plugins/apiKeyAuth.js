const fp = require('fastify-plugin');
const bcrypt = require('bcrypt');

module.exports = fp(async function apiKeyAuth(fastify) {
  const { ApiKey } = fastify.db.models;

  fastify.decorate('verifyApiKey', async function (req, reply) {
    const plaintext = req.headers['x-api-key'];
    if (!plaintext) {
      return reply.code(401).send({ error: 'API key required' });
    }

    // Find last active key (not revoked)
    const key = await ApiKey.findOne({ where: { revokedAt: null }, order: [['id', 'DESC']] });
    if (!key) return reply.code(401).send({ error: 'No active API key' });

    const ok = await bcrypt.compare(plaintext, key.hash);
    if (!ok) return reply.code(401).send({ error: 'Invalid API key' });
  });
});
