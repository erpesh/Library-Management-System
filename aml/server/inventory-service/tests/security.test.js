const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const TEST_SECRET = process.env.NEXTAUTH_SECRET || 'your-dev-secret'; // must match app

function generateToken(secret = TEST_SECRET, payload = {}, overrides = {}) {
    return jwt.sign(
        {
            id: 'test-user-id',
            email: 'user@example.com',
            role: 'user',
            ...payload,
        },
        secret,
        { algorithm: 'HS256', expiresIn: '1h', ...overrides }
    );
}

function generateAdminToken() {
    return generateToken({ role: 'admin', id: 'admin-user-id' });
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Inventory API Security Tests', () => {
    it('T3 should return 401 when calling a protected endpoint without JWT', async () => {
        const response = await request(app).post('/api/inventory');
        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Authorization token is required');
    });

    it('T4 should return 403 when using a JWT signed with an incorrect secret', async () => {
        const invalidToken = `Bearer ${generateToken('invalid-secret')}`;
        const response = await request(app)
            .post('/api/inventory')
            .set('Authorization', invalidToken);
        expect(response.status).toBe(403);
        expect(response.body.error).toBe('Invalid or expired token');
    });

    it('T5 should return 429 when sending more than 30 requests in one minute', async () => {
        const requests = Array.from({ length: 31 }, () =>
            request(app).get('/api/inventory')
        );
        const responses = await Promise.all(requests);
        const lastResponse = responses[responses.length - 1];
        expect(lastResponse.status).toBe(429);
        expect(lastResponse.body.error).toBe('Too many requests. Please try again later.');
    });

    it('T6 should return 403 when trying to delete media as a regular user', async () => {
        const regularUserToken = `Bearer ${generateToken()}`;
        const response = await request(app)
            .delete(`/api/inventory/1`)
            .set('Authorization', regularUserToken);
        expect(response.status).toBe(403);
        expect(response.body.error).toBe('Access denied');
    });

    it('T7 should return 403 when modifying JWT to spoof admin role and access admin endpoint', async () => {
        const spoofedAdminToken = 'Bearer spoofed.jwt.token.with.admin.role';
        const response = await request(app)
            .delete('/api/inventory/admin-only-endpoint')
            .set('Authorization', spoofedAdminToken);
        expect(response.status).toBe(403);
        expect(response.body.error).toBe('Invalid or expired token');
    });
})