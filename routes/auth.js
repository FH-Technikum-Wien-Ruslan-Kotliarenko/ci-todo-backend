// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

const db = require('../db/db');

// [1] Register
router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;
      // Check if the user already exists
      const existingUser = await db.models.user.findOne({ where: { email }});
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create user
      await db.models.user.create({ email, password: hashedPassword });
      
      return res.status(201).json({ message: 'User created successfully' });
    } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// [2] Login
router.post('/login',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = await db.models.user.findOne({ where: { email }});
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const match = await bcrypt.compare(password, user.password);
      if(!match) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Put userId in session
      req.session.userId = user.id;
      return res.status(200).json({ message: 'Login successful' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// [3] Logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if(err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// [4] Get Current Authenticated User
router.get('/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // If we want to return user details, we could fetch from DB here:
  // const user = await db.models.user.findByPk(req.session.userId);
  // return res.json({ id: user.id, email: user.email, ... });

  // For simplicity, just return userId:
  return res.status(200).json({ userId: req.session.userId });
});


module.exports = router;
