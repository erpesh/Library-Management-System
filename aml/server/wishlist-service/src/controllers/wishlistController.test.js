const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const WishlistRecord = require('../models/wishlist');
const inventoryService = require('../services/inventoryService');
const notificationService = require('../services/notificationService');

jest.mock('../services/inventoryService');
jest.mock('../services/notificationService');

describe('Wishlist Controller', () => {
  const baseUrl = '/api/wishlist';
  const userId = new mongoose.Types.ObjectId();
  const mediaId = new mongoose.Types.ObjectId();

  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/test-wishlist', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    await WishlistRecord.deleteMany({});
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /user/:userId/media/:mediaId - Create Wishlist Record', () => {
    it('should create a new wishlist record', async () => {
      const res = await request(app)
        .post(`${baseUrl}/user/${userId}/media/${mediaId}`)
        .send();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.userId).toBe(userId.toString());
      expect(res.body.mediaId).toBe(mediaId.toString());
    });

    it('should return an error if the wishlist item already exists', async () => {
      await WishlistRecord.create({ userId, mediaId });

      const res = await request(app)
        .post(`${baseUrl}/user/${userId}/media/${mediaId}`)
        .send();

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('This item is already in the wishlist.');
    });
  });

  describe('GET /user/:userId/media/:mediaId - Retrieve Wishlist Record', () => {
    it('should retrieve a wishlist record by userId and mediaId', async () => {
      const record = await WishlistRecord.create({ userId, mediaId });

      const res = await request(app)
        .get(`${baseUrl}/user/${userId}/media/${mediaId}`)
        .send();

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(record._id.toString());
      expect(res.body.userId).toBe(userId.toString());
      expect(res.body.mediaId).toBe(mediaId.toString());
    });
  });

  describe('GET /user/:userId - Get All Wishlist Records by UserId', () => {
    it('should return all wishlist records for a user', async () => {
      const mediaId1 = new mongoose.Types.ObjectId();
      const mediaId2 = new mongoose.Types.ObjectId();

      // Seed test data
      await WishlistRecord.create({ userId, mediaId: mediaId1 });
      await WishlistRecord.create({ userId, mediaId: mediaId2 });

      // Mock the inventory service response
      const mockMedia = [
        { _id: mediaId1.toString(), title: 'Media 1' },
        { _id: mediaId2.toString(), title: 'Media 2' },
      ];
      inventoryService.getMediaByIds.mockResolvedValue(mockMedia);

      // Make the request
      const res = await request(app).get(`${baseUrl}/user/${userId}`).send();

      // Assert response
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);

      const mediaIds = [mediaId1.toString(), mediaId2.toString()];

      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            userId: userId.toString(),
            media: expect.objectContaining({ title: 'Media 1' }),
          }),
          expect.objectContaining({
            userId: userId.toString(),
            media: expect.objectContaining({ title: 'Media 2' }),
          }),
        ])
      );
    });
  });

  describe('DELETE /user/:userId/record/:id - Delete Wishlist Record', () => {
    it('should delete a wishlist record', async () => {
      const record = await WishlistRecord.create({ userId, mediaId });

      const res = await request(app)
        .delete(`${baseUrl}/user/${userId}/record/${record._id}`)
        .send();

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Wishlist record deleted successfully.');
    });

    it('should return an error if user is not authorized to delete the record', async () => {
      const record = await WishlistRecord.create({ userId, mediaId });
      const unauthorizedUserId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`${baseUrl}/user/${unauthorizedUserId}/record/${record._id}`)
        .send();

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('You are not authorized to delete this wishlist record.');
    });
  });
});
