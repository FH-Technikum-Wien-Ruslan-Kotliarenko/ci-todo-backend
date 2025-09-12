const crypto = require('crypto');
const bcrypt = require('bcrypt');

module.exports = async function (fastify) {
  const { ApiKey } = fastify.db.models;

  // Rotate key: must authenticate with current key
  fastify.post('/apikeys/rotate', { preHandler: fastify.verifyApiKey }, async (req, reply) => {
    // Revoke previous
    const current = await ApiKey.findOne({ where: { revokedAt: null }, order: [['id', 'DESC']] });
    if (current) {
      await current.update({ revokedAt: new Date() });
    }

    // Generate new plaintext and store hash
    const plaintext = crypto.randomBytes(24).toString('hex'); // 48 hex chars
    const hash = await bcrypt.hash(plaintext, 10);
    await ApiKey.create({ hash });

    // Return plaintext ONCE
    return reply.code(201).send({ apiKey: plaintext });
  });
};
