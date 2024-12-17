const request = require('supertest');
const app = require('../../server');
const WishlistRecord = require('../models/wishlist');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Mock any dependencies like services
jest.mock('../services/inventoryService');
jest.mock('../services/notificationService');

let mongoServer;

beforeAll(async () => {
  // Start an in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to the in-memory database for testing
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Close the database connection and stop the in-memory MongoDB server after tests
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Test creating a new wishlist record
test('Should create a new wishlist record', async () => {
  const res = await request(app)
    .post('/wishlist/user/1/media/2')  // Use the correct route
    .send();

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('_id');
  expect(res.body.userId).toBe('1');
  expect(res.body.mediaId).toBe('2');
});

// Test getting all wishlist records for a user
test('Should get all wishlist records for a user', async () => {
  const res = await request(app)
    .get('/wishlist/user/1')  // Use the correct route
    .send();

  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

// Test deleting a wishlist record by ID
test('Should delete a wishlist record by ID', async () => {
  // First, create a record to delete
  const wishlistRecord = new WishlistRecord({
    userId: '1',
    mediaId: '2',
  });

  await wishlistRecord.save();

  const res = await request(app)
    .delete(`/wishlist/${wishlistRecord._id}/user/1`)  // Use the correct route
    .send();

  expect(res.status).toBe(200);
  expect(res.body.message).toBe('Wishlist record deleted successfully.');
});

// Test handling non-existent routes
test('Should return 404 for non-existent route', async () => {
  const res = await request(app)
    .get('/wishlist/nonexistent')
    .send();

  expect(res.status).toBe(404);
});
