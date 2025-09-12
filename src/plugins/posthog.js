const fp = require('fastify-plugin');
const { PostHog } = require('posthog-node');

module.exports = fp(async (fastify) => {
  const client = new PostHog(process.env.POSTHOG_API_KEY, { host: process.env.POSTHOG_HOST });
  fastify.decorate('ph', client);
  fastify.addHook('onClose', async () => client.shutdown());
  fastify.decorate('isSearchEnabled', async () => {
    try {
      const flag = process.env.FLAG_SEARCH || 'lf-search';
      // anonymous evaluation (no user id): use groups=false or a static key
      return await client.isFeatureEnabled(flag, 'lf-backend');
    } catch {
      return true;
    }
  });
});
