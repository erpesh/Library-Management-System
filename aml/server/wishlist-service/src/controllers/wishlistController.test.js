const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const wishlistRoutes = require('../routes/wishlistRoutes');
const WishlistRecord = require('../models/wishlist');
const mockingoose = require('mockingoose');
const app = express();

// Setup Express app
app.use(express.json());
app.use('/api/wishlist', wishlistRoutes);

// Mock Services
jest.mock('../services/inventoryService', () => ({
  getMediaByIds: jest.fn(),
  getEmailsByUserIds: jest.fn(),
}));

jest.mock('../services/notificationService', () => ({
  sendWishlistNotification: jest.fn(),
}));

describe('Wishlist Routes', () => {

  // Mock data
  const mockWishlistRecord = {
    userId: '12345',
    mediaId: '67890',
    _id: '11111',
    createdAt: '2024-12-17T00:00:00Z',
  };

  const mockMedia = {
    _id: '67890',
    title: 'Sample Media',
    description: 'Description of sample media',
  };

  const mockEmails = {
    '12345': 'user@example.com',
  };

  beforeEach(() => {
    mockingoose.resetAll();
  });

  // Test: Create wishlist record (valid input)
  test('POST /user/:userId/media/:mediaId should create a wishlist record', async () => {
    mockingoose(WishlistRecord).toReturn(mockWishlistRecord, 'save');
    const response = await request(app)
      .post('/api/wishlist/user/12345/media/67890')
      .send(mockWishlistRecord);
    
    expect(response.status).toBe(200);
    expect(response.body.userId).toBe('12345');
    expect(response.body.mediaId).toBe('67890');
  });

  // Test: Create wishlist record (duplicate)
  test('POST /user/:userId/media/:mediaId should return 400 if record already exists', async () => {
    mockingoose(WishlistRecord).toReturn(mockWishlistRecord, 'findOne');
    const response = await request(app)
      .post('/api/wishlist/user/12345/media/67890')
      .send(mockWishlistRecord);
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('This item is already in the wishlist.');
  });

  // Test: Get wishlist record by userId and mediaId (valid)
  test('GET /user/:userId/media/:mediaId should return a wishlist record', async () => {
    mockingoose(WishlistRecord).toReturn(mockWishlistRecord, 'findOne');
    const response = await request(app)
      .get('/api/wishlist/user/12345/media/67890');
    
    expect(response.status).toBe(200);
    expect(response.body.userId).toBe('12345');
    expect(response.body.mediaId).toBe('67890');
  });

  // Test: Get wishlist record by userId and mediaId (not found)
  test('GET /user/:userId/media/:mediaId should return 404 if record not found', async () => {
    mockingoose(WishlistRecord).toReturn(null, 'findOne');
    const response = await request(app)
      .get('/api/wishlist/user/12345/media/67890');
    
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Wishlist record not found.');
  });

  // Test: Get wishlist by userId
  test('GET /user/:userId should return all wishlist records by userId', async () => {
    mockingoose(WishlistRecord).toReturn([mockWishlistRecord], 'find');
    const response = await request(app)
      .get('/api/wishlist/user/12345');
    
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].userId).toBe('12345');
  });

  // Test: Delete wishlist record by id (valid)
  test('DELETE /user/:userId/record/:id should delete a wishlist record', async () => {
    mockingoose(WishlistRecord).toReturn(mockWishlistRecord, 'findById');
    mockingoose(WishlistRecord).toReturn(mockWishlistRecord, 'findByIdAndDelete');
    const response = await request(app)
      .delete('/api/wishlist/user/12345/record/11111');
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Wishlist record deleted successfully.');
  });

  // Test: Delete wishlist record by id (not authorized)
  test('DELETE /user/:userId/record/:id should return 403 if not authorized', async () => {
    const invalidWishlistRecord = { ...mockWishlistRecord, userId: '54321' };
    mockingoose(WishlistRecord).toReturn(invalidWishlistRecord, 'findById');
    const response = await request(app)
      .delete('/api/wishlist/user/12345/record/11111');
    
    expect(response.status).toBe(403);
    expect(response.body.message).toBe('You are not authorized to delete this wishlist record.');
  });

  // Test: Get records by mediaId and notify users (valid)
  test('POST /media/:mediaId should send notifications to users', async () => {
    mockingoose(WishlistRecord).toReturn([mockWishlistRecord], 'find');
    mockingoose(WishlistRecord).toReturn(mockMedia, 'getMediaByIds');
    jest.mock('../services/inventoryService').getEmailsByUserIds.mockReturnValue(mockEmails);
    
    const response = await request(app)
      .post('/api/wishlist/media/67890')
      .send({ mediaId: '67890' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Request to Notification Service sent successfully.');
  });

  // Test: Get records by mediaId and notify users (no records)
  test('POST /media/:mediaId should return 200 if no records found', async () => {
    mockingoose(WishlistRecord).toReturn([], 'find');
    const response = await request(app)
      .post('/api/wishlist/media/67890')
      .send({ mediaId: '67890' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('No wishlist records found for this mediaId.');
  });

  // Test: Invalid input for POST /user/:userId/media/:mediaId
  test('POST /user/:userId/media/:mediaId should return 400 for invalid userId format', async () => {
    const response = await request(app)
      .post('/api/wishlist/user/invalidUserId/media/67890')
      .send(mockWishlistRecord);
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid userId format.');
  });

});
