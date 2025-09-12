module.exports = {
  async truncateAll(fastify) {
    const { Item, ApiKey } = fastify.db.models;
    await Item.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
    await ApiKey.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
  }
};
