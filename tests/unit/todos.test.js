/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../../app');
const db = require('../../db/db');

describe('Todos Routes', () => {
  let authCookie; // We'll store the session cookie here

  beforeAll(async () => {
    // Optionally sync DB or run migrations
    // await db.sync({ force: true });
    
    // Create a user first (and log in) so we can test protected routes
    await request(app).post('/api/auth/register').send({
      email: 'test_todos@example.com',
      password: 'testpass'
    });

    // Login and store cookie
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test_todos@example.com', password: 'testpass' });

    authCookie = loginRes.headers['set-cookie']; 
  });

  afterAll(async () => {
    await db.close();
  });

  // [Test 1] GET /api/todos -> 401 if not authenticated
  it('GET /api/todos -> 401 if no session', async () => {
    const res = await request(app)
      .get('/api/todos'); // no cookie
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Not authenticated');
  });

  // [Test 2] GET /api/todos -> 200 if authenticated, returns empty list initially
  it('GET /api/todos -> returns empty array if no todos for user', async () => {
    const res = await request(app)
      .get('/api/todos')
      .set('Cookie', authCookie);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  // [Test 3] POST /api/todos -> creates a todo
  it('POST /api/todos -> 201 Created', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Cookie', authCookie)
      .send({ name: 'My first todo' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', 'My first todo');
    expect(res.body).toHaveProperty('userId'); // Should match our user
  });

  // [Test 4] PUT /api/todos/:id/done -> marks todo as done
  it('PUT /api/todos/:id/done -> marks as done', async () => {
    // First create a todo
    const created = await request(app)
      .post('/api/todos')
      .set('Cookie', authCookie)
      .send({ name: 'Todo to mark done' });
    
    const todoId = created.body.id;

    // Now mark as done
    const res = await request(app)
      .put(`/api/todos/${todoId}/done`)
      .set('Cookie', authCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('done', true);
    expect(res.body).toHaveProperty('completedAt');
  });

  // [Test 5] DELETE /api/todos/:id/done -> marks todo as undone
  it('DELETE /api/todos/:id/done -> marks as undone', async () => {
    // First create a todo that's already done
    const created = await request(app)
      .post('/api/todos')
      .set('Cookie', authCookie)
      .send({ name: 'Todo to mark undone' });
    
    const todoId = created.body.id;
    // Mark it done
    await request(app)
      .put(`/api/todos/${todoId}/done`)
      .set('Cookie', authCookie);

    // Now undo
    const res = await request(app)
      .delete(`/api/todos/${todoId}/done`)
      .set('Cookie', authCookie);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('done', false);
  });
});
