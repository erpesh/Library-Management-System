const request = require('supertest');
const app = require('../app'); 
const WishlistRecord = require('../models/wishlist');
const { getMediaByIds, getEmailsByUserIds } = require('../services/inventoryService');
const { sendWishlistNotification } = require('../services/notificationService');

// Mock services
jest.mock('../services/inventoryService');
jest.mock('../services/notificationService');

describe('Wishlist Controller Tests', () => {
    let userId = 'testUserId';
    let mediaId = 'testMediaId';

    // Test createWishlistRecord
    describe('POST /wishlist/:userId/:mediaId', () => {
        it('should create a new wishlist record if it doesn’t exist', async () => {
            // Mock the Mongoose model methods
            WishlistRecord.findOne = jest.fn().mockResolvedValue(null);
            WishlistRecord.prototype.save = jest.fn().mockResolvedValue({ userId, mediaId });

            const response = await request(app)
                .post(`/wishlist/${userId}/${mediaId}`)
                .expect(200);
            
            expect(response.body.userId).toBe(userId);
            expect(response.body.mediaId).toBe(mediaId);
        });

        it('should return an error if the wishlist record already exists', async () => {
            WishlistRecord.findOne = jest.fn().mockResolvedValue({ userId, mediaId });

            const response = await request(app)
                .post(`/wishlist/${userId}/${mediaId}`)
                .expect(400);

            expect(response.body.message).toBe("This item is already in the wishlist.");
        });

        it('should return an error for invalid userId or mediaId', async () => {
            const response = await request(app)
                .post(`/wishlist/invalidUserId/invalidMediaId`)
                .expect(400);

            expect(response.body.message).toBe("Invalid userId or mediaId.");
        });

        it('should return an error if database fails to create a record', async () => {
            WishlistRecord.findOne = jest.fn().mockResolvedValue(null);
            WishlistRecord.prototype.save = jest.fn().mockRejectedValue(new Error("Database error"));

            const response = await request(app)
                .post(`/wishlist/${userId}/${mediaId}`)
                .expect(500);

            expect(response.body.message).toBe("Internal server error.");
        });
    });

    // Test getWishlistRecordByUserIdAndMediaId
    describe('GET /wishlist/:userId/:mediaId', () => {
        it('should retrieve the wishlist record by userId and mediaId', async () => {
            const wishlistRecord = { userId, mediaId, createdAt: '2024-12-01' };
            WishlistRecord.findOne = jest.fn().mockResolvedValue(wishlistRecord);

            const response = await request(app)
                .get(`/wishlist/${userId}/${mediaId}`)
                .expect(200);

            expect(response.body.userId).toBe(userId);
            expect(response.body.mediaId).toBe(mediaId);
        });

        it('should return an error if the wishlist record is not found', async () => {
            WishlistRecord.findOne = jest.fn().mockResolvedValue(null);

            const response = await request(app)
                .get(`/wishlist/${userId}/${mediaId}`)
                .expect(404);

            expect(response.body.message).toBe("Wishlist record not found.");
        });

        it('should return an error if userId or mediaId is invalid', async () => {
            const response = await request(app)
                .get(`/wishlist/invalidUserId/invalidMediaId`)
                .expect(400);

            expect(response.body.message).toBe("Invalid userId or mediaId.");
        });
    });

    // Test getWishlistByUserId
    describe('GET /wishlist/:userId', () => {
        it('should retrieve all wishlist records for a user', async () => {
            const wishlist = [{ userId, mediaId, createdAt: '2024-12-01' }];
            WishlistRecord.find = jest.fn().mockResolvedValue(wishlist);
            getMediaByIds.mockResolvedValue([{ _id: mediaId, title: 'Media Title' }]);

            const response = await request(app)
                .get(`/wishlist/${userId}`)
                .expect(200);

            expect(response.body[0].userId).toBe(userId);
            expect(response.body[0].mediaId).toBe(mediaId);
            expect(response.body[0].media.title).toBe('Media Title');
        });

        it('should return an error if no wishlist records are found', async () => {
            WishlistRecord.find = jest.fn().mockResolvedValue([]);
            
            const response = await request(app)
                .get(`/wishlist/${userId}`)
                .expect(404);

            expect(response.body.message).toBe("No wishlist records found for this user.");
        });

        it('should handle errors from the media service gracefully', async () => {
            getMediaByIds.mockRejectedValue(new Error("Media service error"));

            const response = await request(app)
                .get(`/wishlist/${userId}`)
                .expect(500);

            expect(response.body.message).toBe("Error retrieving media information.");
        });
    });

    // Test deleteWishlistRecordById
    describe('DELETE /wishlist/:id', () => {
        it('should delete the wishlist record by id', async () => {
            const wishlistRecord = { userId, mediaId, _id: 'recordId' };
            WishlistRecord.findById = jest.fn().mockResolvedValue(wishlistRecord);
            WishlistRecord.findByIdAndDelete = jest.fn().mockResolvedValue(wishlistRecord);

            const response = await request(app)
                .delete(`/wishlist/recordId`)
                .set('userId', userId)
                .expect(200);

            expect(response.body.message).toBe("Wishlist record deleted successfully.");
        });

        it('should return an error if the user is not authorized to delete the record', async () => {
            const wishlistRecord = { userId: 'differentUserId', mediaId, _id: 'recordId' };
            WishlistRecord.findById = jest.fn().mockResolvedValue(wishlistRecord);

            const response = await request(app)
                .delete(`/wishlist/recordId`)
                .set('userId', userId)
                .expect(403);

            expect(response.body.message).toBe("You are not authorized to delete this wishlist record.");
        });

        it('should return an error if record is not found for deletion', async () => {
            WishlistRecord.findById = jest.fn().mockResolvedValue(null);

            const response = await request(app)
                .delete(`/wishlist/invalidId`)
                .set('userId', userId)
                .expect(404);

            expect(response.body.message).toBe("Wishlist record not found.");
        });
    });

    // Test getRecordsByMediaIdAndNotify
    describe('POST /wishlist/notify/:mediaId', () => {
        it('should send notifications to users who have the media in their wishlist', async () => {
            const wishlistRecords = [{ userId, mediaId }];
            WishlistRecord.find = jest.fn().mockResolvedValue(wishlistRecords);
            getMediaByIds.mockResolvedValue([{ _id: mediaId, title: 'Media Title' }]);
            getEmailsByUserIds.mockResolvedValue({ [userId]: 'user@example.com' });

            const response = await request(app)
                .post(`/wishlist/notify/${mediaId}`)
                .expect(200);

            expect(response.body.message).toBe("Request to Notification Service sent successfully.");
        });

        it('should return an error if no wishlist records found for the mediaId', async () => {
            WishlistRecord.find = jest.fn().mockResolvedValue([]);

            const response = await request(app)
                .post(`/wishlist/notify/${mediaId}`)
                .expect(200);

            expect(response.body.message).toBe("No wishlist records found for this mediaId.");
        });

        it('should return an error if notification service fails', async () => {
            WishlistRecord.find = jest.fn().mockResolvedValue([{ userId, mediaId }]);
            getMediaByIds.mockResolvedValue([{ _id: mediaId, title: 'Media Title' }]);
            getEmailsByUserIds.mockResolvedValue({ [userId]: 'user@example.com' });
            sendWishlistNotification.mockRejectedValue(new Error("Notification service error"));

            const response = await request(app)
                .post(`/wishlist/notify/${mediaId}`)
                .expect(500);

            expect(response.body.message).toBe("Error sending notifications.");
        });
    });
});
