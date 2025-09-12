const bcrypt = require('bcrypt');

module.exports = async (fastify, plaintext = 'test-key-1234567890') => {
  const { ApiKey } = fastify.db.models;
  const hash = await bcrypt.hash(plaintext, 10);
  await ApiKey.create({ hash });
  return plaintext;
};
