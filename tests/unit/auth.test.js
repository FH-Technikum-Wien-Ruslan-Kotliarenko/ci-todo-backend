/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../../app');
const db = require('../../db/db');

// Optional: set up test DB or mock
// e.g., you might have a special DB for tests, or you can mock calls.

describe('Auth Routes', () => {
  // Before/After hooks to reset DB, if you want a clean state each test
  beforeAll(async () => {
    // Optionally sync DB or run migrations
    // await db.sync({ force: true });
  });

  afterAll(async () => {
    // Close DB connection
    await db.close();
  });

  // [Test 1] Register a user successfully
  it('POST /api/auth/register -> 201 Created', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'john@example.com',
        password: 'secret123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User created successfully');
  });

  // [Test 2] Register fails if email already used
  it('POST /api/auth/register -> 400 if email is already in use', async () => {
    // Attempt to register same email again
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'john@example.com',
        password: 'anotherSecret'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Email already in use');
  });

  // [Test 3] Login successfully
  it('POST /api/auth/login -> 200 OK (login successful)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john@example.com',
        password: 'secret123'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
  });

  // [Test 4] Login fails with incorrect credentials
  it('POST /api/auth/login -> 401 if invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john@example.com',
        password: 'wrongPassword'
      });
    
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });

  // [Test 5] Current user endpoint (/me) requires authentication
  it('GET /api/auth/me -> 401 if not authenticated', async () => {
    const res = await request(app)
      .get('/api/auth/me');
    
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Not authenticated');
  });

  // Optionally, you could add a test for /logout as well,
  // but we've already got 5 for demonstration here.
});
