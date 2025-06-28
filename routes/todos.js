// routes/todos.js
const { body, validationResult } = require('express-validator');
const db = require('../db/db');
var express = require('express');
var router = express.Router();

/* Helper: check authentication */
function isAuthenticated(req, res) {
  if (!req.session.userId) {
    // Not logged in
    res.status(401).json({ error: 'Not authenticated' });
    return false;
  }
  return true;
}

/* Read all todos for the current user */
router.get('/', async (req, res) => {
  if (!isAuthenticated(req, res)) return;

  const todos = await db.models.todo.findAll({
    where: { userId: req.session.userId }
  });
  res.status(200).json(todos);
});

/* Create todo for the current user */
router.post('/',
  body('name').not().isEmpty(),
  body('name').isLength({ max: 255 }),
  async (req, res) => {
    if (!isAuthenticated(req, res)) return;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const todo = await db.models.todo.create({
      name: req.body.name,
      userId: req.session.userId
    });
    res.status(201).json(todo);
});

/* Mark todo as done */
router.put('/:id/done', async (req, res) => {
  if (!isAuthenticated(req, res)) return;

  const pk = req.params.id;
  let todo = await db.models.todo.findOne({
    where: { id: pk, userId: req.session.userId }
  });
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  todo = await todo.update({ done: true, completedAt: new Date() });
  res.status(200).json(todo);
});

/* Mark todo as undone */
router.delete('/:id/done', async (req, res) => {
  if (!isAuthenticated(req, res)) return;

  const pk = req.params.id;
  let todo = await db.models.todo.findOne({
    where: { id: pk, userId: req.session.userId }
  });
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  todo = await todo.update({ done: false });
  res.status(200).json(todo);
});

module.exports = router;
