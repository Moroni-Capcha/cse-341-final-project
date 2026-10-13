const request = require('supertest');

const mockDb = {
  collection: jest.fn().mockReturnValue({
    find: jest.fn().mockReturnValue({ toArray: jest.fn().mockResolvedValue([]) }),
    findOne: jest.fn().mockResolvedValue(null)
  })
};

jest.mock('../db/connect', () => ({
  getDb: jest.fn(() => mockDb),
  initDb: jest.fn((cb) => cb(null, mockDb))
}));

process.env.NODE_ENV = 'test';
const app = require('../server');

describe('OAuth Authentication and Route Protection Tests', () => {
  test('1. GET /auth/status - Returns unauthenticated state when no session exists', async () => {
    const res = await request(app).get('/auth/status');
    expect(res.statusCode).toBe(200);
    expect(res.body.authenticated).toBe(false);
    expect(res.body.user).toBeNull();
  });

  test('2. POST /projects - Denies unauthenticated access with 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/projects')
      .send({
        title: 'Unauthorized Project',
        description: 'Should be rejected',
        userId: '670732808b89e3bb8e8c1111'
      });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/You do not have access/i);
  });

  test('3. POST /experiences - Denies unauthenticated access with 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/experiences')
      .send({
        userId: '670732808b89e3bb8e8c1111',
        company: 'Blocked Inc.',
        role: 'Tester',
        startDate: '2024-01-01',
        description: 'Should be rejected'
      });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/You do not have access/i);
  });

  test('4. GET /contacts - Denies unauthenticated access to private recruiter messages with 401', async () => {
    const res = await request(app).get('/contacts');
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/You do not have access/i);
  });
});

