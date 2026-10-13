const request = require('supertest');
const { ObjectId } = require('mongodb');

// Mock database connection before importing app
const mockUserId = '670732808b89e3bb8e8c1111';
const mockUser = {
  _id: new ObjectId(mockUserId),
  username: 'johndoe',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'Full Stack Developer',
  skills: ['JavaScript', 'Node.js', 'Express', 'MongoDB']
};

const mockCollection = {
  find: jest.fn().mockReturnValue({
    toArray: jest.fn().mockResolvedValue([mockUser])
  }),
  findOne: jest.fn().mockImplementation((query) => {
    if (query._id && query._id.toString() === mockUserId) {
      return Promise.resolve(mockUser);
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

describe('Users Collection - GET Endpoints Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. GET /users - Successfully retrieves all users (GetAll route)', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].username).toBe('johndoe');
  });

  test('2. GET /users/:id - Successfully retrieves a user by valid ID (GetById route)', async () => {
    const res = await request(app).get(`/users/${mockUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body._id).toBe(mockUserId);
    expect(res.body.email).toBe('john.doe@example.com');
  });

  test('3. GET /users/:id - Returns 404 when user ID is not found', async () => {
    const nonExistentId = '670732808b89e3bb8e8c9999';
    const res = await request(app).get(`/users/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/not found/i);
  });

  test('4. GET /users/:id - Returns 400 when ID format is invalid', async () => {
    const invalidId = '123-invalid-id';
    const res = await request(app).get(`/users/${invalidId}`);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/Invalid ID format/i);
  });
});

