const { Op } = require('sequelize');

module.exports = async function (fastify) {
  const { Item } = fastify.db.models;
  const SEARCH_ENABLED = (process.env.SEARCH_ENABLED || 'true').toLowerCase() === 'true';
  const DEFAULT_PAGE_SIZE = Number(process.env.DEFAULT_PAGE_SIZE || 20);
  const MAX_PAGE_SIZE = Number(process.env.MAX_PAGE_SIZE || 100);

  // Public list with pagination + sort + (optional) LIKE search
  fastify.get(
    '/items',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            q: { type: 'string' },
            sort: { type: 'string', enum: ['newest', 'oldest'], default: 'newest' },
            page: { type: 'integer', minimum: 1, default: 1 },
            pageSize: {
              type: 'integer',
              minimum: 1,
              maximum: MAX_PAGE_SIZE,
              default: DEFAULT_PAGE_SIZE
            }
          }
        }
      }
    },
    async (req, reply) => {
      const { q, sort = 'newest', page = 1, pageSize = DEFAULT_PAGE_SIZE } = req.query;

      const where = {};
      if (SEARCH_ENABLED && q && q.trim()) {
        const term = `%${q.trim()}%`;
        where[Op.or] = [{ name: { [Op.like]: term } }, { description: { [Op.like]: term } }];
      }

      const order = sort === 'oldest' ? [['createdAt', 'ASC']] : [['createdAt', 'DESC']];

      const { rows, count } = await Item.findAndCountAll({
        where,
        order,
        offset: (page - 1) * pageSize,
        limit: pageSize
      });

      return reply.send({
        data: rows,
        meta: { page, pageSize, total: count, pages: Math.ceil(count / pageSize) }
      });
    }
  );

  // Public: get by id
  fastify.get('/items/:id', async (req, reply) => {
    const item = await Item.findByPk(req.params.id);
    if (!item) return reply.code(404).send({ error: 'Not found' });
    return item;
  });

  // Auth protected: create
  fastify.post('/items', { preHandler: fastify.verifyApiKey }, async (req, reply) => {
    const { name, description } = req.body || {};
    if (!name || typeof name !== 'string') return reply.code(400).send({ error: 'name required' });
    const created = await Item.create({ name, description });
    return reply.code(201).send(created);
  });

  // Auth protected: update
  fastify.put('/items/:id', { preHandler: fastify.verifyApiKey }, async (req, reply) => {
    const { name, description } = req.body || {};
    const item = await Item.findByPk(req.params.id);
    if (!item) return reply.code(404).send({ error: 'Not found' });
    await item.update({ name: name ?? item.name, description: description ?? item.description });
    return item;
  });

  // Auth protected: delete
  fastify.delete('/items/:id', { preHandler: fastify.verifyApiKey }, async (req, reply) => {
    const item = await Item.findByPk(req.params.id);
    if (!item) return reply.code(404).send({ error: 'Not found' });
    await item.destroy();
    return reply.code(204).send();
  });
};
