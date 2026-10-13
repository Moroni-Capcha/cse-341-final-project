const request = require('supertest');
const { ObjectId } = require('mongodb');

const mockContactId = '670732808b89e3bb8e8c4444';
const mockContact = {
  _id: new ObjectId(mockContactId),
  userId: '670732808b89e3bb8e8c1111',
  senderName: 'Sarah Connor',
  senderEmail: 'sarah.connor@example.com',
  subject: 'Senior Developer Opportunity',
  message: 'Hello, I reviewed your portfolio and would love to discuss an open backend developer position.',
  read: false
};

const mockCollection = {
  find: jest.fn().mockReturnValue({
    toArray: jest.fn().mockResolvedValue([mockContact])
  }),
  findOne: jest.fn().mockImplementation((query) => {
    if (query._id && query._id.toString() === mockContactId) {
      return Promise.resolve(mockContact);
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

// Mock authentication to simulate an authorized session for GET testing
jest.mock('../middleware/authenticate', () => ({
  isAuthenticated: (req, res, next) => next()
}));

process.env.NODE_ENV = 'test';
const app = require('../server');

describe('Contacts Collection - GET Endpoints Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. GET /contacts - Successfully retrieves all contacts (GetAll route)', async () => {
    const res = await request(app).get('/contacts');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].senderName).toBe('Sarah Connor');
    expect(res.body[0].subject).toBe('Senior Developer Opportunity');
  });

  test('2. GET /contacts/:id - Successfully retrieves a contact by valid ID (GetById route)', async () => {
    const res = await request(app).get(`/contacts/${mockContactId}`);
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body._id).toBe(mockContactId);
    expect(res.body.senderEmail).toBe('sarah.connor@example.com');
  });

  test('3. GET /contacts/:id - Returns 404 when contact message ID is not found', async () => {
    const nonExistentId = '670732808b89e3bb8e8c9999';
    const res = await request(app).get(`/contacts/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/not found/i);
  });

  test('4. GET /contacts/:id - Returns 400 when ID format is invalid', async () => {
    const invalidId = 'short-id';
    const res = await request(app).get(`/contacts/${invalidId}`);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/Invalid ID format/i);
  });
});

