const request = require('supertest');
const app = require('../../server');
const WishlistRecord = require('../models/wishlist');
const mongoose = require('mongoose');

// Mock any dependencies like services
jest.mock('../services/inventoryService');
jest.mock('../services/notificationService');

describe('Wishlist API Tests', () => {
  beforeAll(async () => {
    // Connect to the database for testing
    await mongoose.connect('mongodb://localhost:27017/test_wishlist', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Close the database connection after all tests
    await mongoose.connection.close();
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

  // Test getting all wishlist records by userId
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
});
