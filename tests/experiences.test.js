const request = require('supertest');
const { ObjectId } = require('mongodb');

const mockExperienceId = '670732808b89e3bb8e8c3333';
const mockExperience = {
  _id: new ObjectId(mockExperienceId),
  userId: '670732808b89e3bb8e8c1111',
  company: 'Tech Solutions Inc.',
  role: 'Backend Engineer',
  location: 'Remote',
  startDate: '2024-01-15',
  endDate: null,
  current: true,
  description: 'Architecting and maintaining cloud REST APIs using Node.js, Express, and MongoDB Atlas.',
  technologies: ['Node.js', 'Express', 'MongoDB', 'Docker', 'AWS']
};

const mockCollection = {
  find: jest.fn().mockReturnValue({
    toArray: jest.fn().mockResolvedValue([mockExperience])
  }),
  findOne: jest.fn().mockImplementation((query) => {
    if (query._id && query._id.toString() === mockExperienceId) {
      return Promise.resolve(mockExperience);
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

describe('Experiences Collection - GET Endpoints Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. GET /experiences - Successfully retrieves all experiences (GetAll route)', async () => {
    const res = await request(app).get('/experiences');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].company).toBe('Tech Solutions Inc.');
    expect(res.body[0].role).toBe('Backend Engineer');
  });

  test('2. GET /experiences/:id - Successfully retrieves an experience by valid ID (GetById route)', async () => {
    const res = await request(app).get(`/experiences/${mockExperienceId}`);
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body._id).toBe(mockExperienceId);
    expect(res.body.company).toBe('Tech Solutions Inc.');
  });

  test('3. GET /experiences/:id - Returns 404 when experience ID is not found', async () => {
    const nonExistentId = '670732808b89e3bb8e8c9999';
    const res = await request(app).get(`/experiences/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/not found/i);
  });

  test('4. GET /experiences/:id - Returns 400 when ID format is invalid', async () => {
    const invalidId = 'bad-id-12345';
    const res = await request(app).get(`/experiences/${invalidId}`);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/Invalid ID format/i);
  });
});

