const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); // One level back to src
const Wishlist = require('../models/wishlist');  // Assuming the Wishlist model is in the models directory

let mongoServer;

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

beforeEach(async () => {
  await Wishlist.deleteMany();
});

describe('Wishlist API Endpoints', () => {
  const sampleWishlistItem = {
    title: 'Sample Item',
    mediaType: 'movie',
    genre: 'Action',
    description: 'A sample movie description',
    addedBy: 'UserId123',
  };

  it('TC001 should create a new wishlist item', async () => {
    const response = await request(app).post('/api/wishlist').send(sampleWishlistItem);
    expect(response.status).toBe(201);
    expect(response.body.title).toBe(sampleWishlistItem.title);

    const wishlistItemInDb = await Wishlist.findOne({ title: sampleWishlistItem.title });
    expect(wishlistItemInDb).toBeTruthy();
    expect(wishlistItemInDb.genre).toBe(sampleWishlistItem.genre);
  });

  it('TC002 should fail to create a wishlist item with invalid data', async () => {
    const invalidData = { title: '', mediaType: 'unknownType' };
    const response = await request(app).post('/api/wishlist').send(invalidData);
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Wishlist validation failed');
  });

  it('TC003 should retrieve all wishlist items', async () => {
    await Wishlist.create(sampleWishlistItem);
    const response = await request(app).get('/api/wishlist');
    expect(response.status).toBe(200);
    expect(response.body.wishlistItems.length).toBe(1);
    expect(response.body.wishlistItems[0].title).toBe(sampleWishlistItem.title);
  });

  it('TC004 should retrieve a wishlist item by ID', async () => {
    const wishlistItem = await Wishlist.create(sampleWishlistItem);
    const response = await request(app).get(`/api/wishlist/${wishlistItem._id}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(wishlistItem.title);
  });

  it('TC005 should return 404 for retrieving a non-existent wishlist item', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/wishlist/${nonExistentId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Wishlist item not found');
  });

  it('TC006 should update a wishlist item by ID', async () => {
    const wishlistItem = await Wishlist.create(sampleWishlistItem);
    const updatedData = { description: 'Updated description' };
    const response = await request(app).put(`/api/wishlist/${wishlistItem._id}`).send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body.description).toBe(updatedData.description);
  });

  it('TC007 should delete a wishlist item by ID', async () => {
    const wishlistItem = await Wishlist.create(sampleWishlistItem);
    const response = await request(app).delete(`/api/wishlist/${wishlistItem._id}`);
    expect(response.status).toBe(200);
    const deletedItem = await Wishlist.findById(wishlistItem._id);
    expect(deletedItem).toBeNull();
  });

  it('TC008 should return 404 when deleting a non-existent wishlist item', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).delete(`/api/wishlist/${nonExistentId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Wishlist item not found');
  });

  it('TC009 should check availability of a wishlist item', async () => {
    const wishlistItem = await Wishlist.create(sampleWishlistItem);
    const response = await request(app).get(`/api/wishlist/${wishlistItem._id}/available`);
    expect(response.status).toBe(200);
    expect(response.body.available).toBe(true);
  });

  it('TC010 should return 404 for checking availability of a non-existent wishlist item', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/wishlist/${nonExistentId}/available`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Wishlist item not found');
  });

  it('TC011 should add item to wishlist if it doesn’t exist', async () => {
    const response = await request(app).post('/api/wishlist').send(sampleWishlistItem);
    expect(response.status).toBe(201);
    expect(response.body.title).toBe(sampleWishlistItem.title);
  });

  it('TC012 should return 400 when trying to add duplicate item to wishlist', async () => {
    await Wishlist.create(sampleWishlistItem);
    const response = await request(app).post('/api/wishlist').send(sampleWishlistItem);
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Duplicate wishlist item');
  });

  it('TC013 should return 400 when invalid ObjectId is passed for wishlist item', async () => {
    const invalidId = '123invalidId';
    const responses = await Promise.all([
      request(app).get(`/api/wishlist/${invalidId}`),
      request(app).put(`/api/wishlist/${invalidId}`).send({ description: 'Updated description' }),
      request(app).delete(`/api/wishlist/${invalidId}`),
    ]);

    responses.forEach((response) => {
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Cast to ObjectId failed');
    });
  });
});
