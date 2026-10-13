const request = require('supertest');
const { ObjectId } = require('mongodb');

const mockProjectId = '670732808b89e3bb8e8c2222';
const mockProject = {
  _id: new ObjectId(mockProjectId),
  title: 'E-Commerce Platform',
  description: 'A full-stack e-commerce web application with payment gateway.',
  userId: '670732808b89e3bb8e8c1111',
  technologies: ['Node.js', 'MongoDB', 'Express', 'Stripe'],
  githubRepo: 'https://github.com/johndoe/ecommerce-app',
  liveUrl: 'https://ecommerce-demo.onrender.com',
  completed: true,
  featured: true
};

const mockCollection = {
  find: jest.fn().mockReturnValue({
    toArray: jest.fn().mockResolvedValue([mockProject])
  }),
  findOne: jest.fn().mockImplementation((query) => {
    if (query._id && query._id.toString() === mockProjectId) {
      return Promise.resolve(mockProject);
    }
    return Promise.resolve(null);
  })
};

const mockDb = {
  collection: jest.fn().mockReturnValue(mockCollection)
};

jest.mock('../db/connect', () => ({
  getDb: jest.fn(() => mockDb),
  initDb: jest.fn((cb) => cb(null, mockDb))
}));

process.env.NODE_ENV = 'test';
const app = require('../server');

describe('Projects Collection - GET Endpoints Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. GET /projects - Successfully retrieves all projects (GetAll route)', async () => {
    const res = await request(app).get('/projects');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('E-Commerce Platform');
  });

  test('2. GET /projects/:id - Successfully retrieves a project by valid ID (GetById route)', async () => {
    const res = await request(app).get(`/projects/${mockProjectId}`);
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body._id).toBe(mockProjectId);
    expect(res.body.userId).toBe('670732808b89e3bb8e8c1111');
  });

  test('3. GET /projects/:id - Returns 404 when project ID is not found', async () => {
    const nonExistentId = '670732808b89e3bb8e8c9999';
    const res = await request(app).get(`/projects/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/not found/i);
  });

  test('4. GET /projects/:id - Returns 400 when ID format is invalid', async () => {
    const invalidId = 'invalid-id-xyz';
    const res = await request(app).get(`/projects/${invalidId}`);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/Invalid ID format/i);
  });
});

