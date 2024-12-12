const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Media = require('../src/models/media');

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
  await Media.deleteMany();
});

describe('Inventory API Endpoints', () => {
  const sampleMedia = {
    title: 'Sample Book',
    mediaType: 'book',
    genre: 'Fiction',
    stock: 10,
    description: 'A sample book description',
    author: 'Author Name',
  };

  it('should create a new media item', async () => {
    const response = await request(app).post('/api/inventory').send(sampleMedia);
    expect(response.status).toBe(201);
    expect(response.body.title).toBe(sampleMedia.title);

    const mediaInDb = await Media.findOne({ title: sampleMedia.title });
    expect(mediaInDb).toBeTruthy();
    expect(mediaInDb.genre).toBe(sampleMedia.genre);
  });

  it('should retrieve all media items', async () => {
    await Media.create(sampleMedia);
    const response = await request(app).get('/api/inventory');
    expect(response.status).toBe(200);
    expect(response.body.mediaItems.length).toBe(1);
    expect(response.body.mediaItems[0].title).toBe(sampleMedia.title);
  });

  it('should retrieve a media item by ID', async () => {
    const media = await Media.create(sampleMedia);
    const response = await request(app).get(`/api/inventory/${media._id}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(media.title);
  });

  it('should update a media item by ID', async () => {
    const media = await Media.create(sampleMedia);
    const updatedData = { stock: 20 };
    const response = await request(app).put(`/api/inventory/${media._id}`).send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body.stock).toBe(updatedData.stock);
  });

  it('should delete a media item by ID', async () => {
    const media = await Media.create(sampleMedia);
    const response = await request(app).delete(`/api/inventory/${media._id}`);
    expect(response.status).toBe(200);
    const deletedMedia = await Media.findById(media._id);
    expect(deletedMedia).toBeNull();
  });

  it('should check availability of a media item', async () => {
    const media = await Media.create(sampleMedia);
    const response = await request(app).get(`/api/inventory/${media._id}/available`);
    expect(response.status).toBe(200);
    expect(response.body.available).toBe(true);
  });

  it('should borrow a media item', async () => {
    const media = await Media.create(sampleMedia);
    const response = await request(app).post(`/api/inventory/${media._id}/borrow`);
    expect(response.status).toBe(200);
    const updatedMedia = await Media.findById(media._id);
    expect(updatedMedia.borrowed).toBe(1);
  });

  it('should not borrow a media item if none available', async () => {
    const media = await Media.create({ ...sampleMedia, stock: 1, borrowed: 1 });
    const response = await request(app).post(`/api/inventory/${media._id}/borrow`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Media not available for borrowing');
  });

  it('should return a borrowed media item', async () => {
    const media = await Media.create({ ...sampleMedia, borrowed: 1 });
    const response = await request(app).post(`/api/inventory/${media._id}/return`);
    expect(response.status).toBe(200);
    const updatedMedia = await Media.findById(media._id);
    expect(updatedMedia.borrowed).toBe(0);
  });

  it('should not return a media item if none are borrowed', async () => {
    const media = await Media.create(sampleMedia);
    const response = await request(app).post(`/api/inventory/${media._id}/return`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No borrowed media to return');
  });

  it('should fail to create a new media item with invalid data', async () => {
    const invalidData = { title: '', mediaType: 'unknownType', stock: -1 };
    const response = await request(app).post('/api/inventory').send(invalidData);
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Media validation failed');
  });

  it('should return 404 for retrieving a non-existent media item', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/inventory/${nonExistentId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Media not found');
  });

  // Skipped test
  it.skip('should return 400 when updating a media item with invalid data', async () => {
    const media = await Media.create(sampleMedia);
    const invalidData = { stock: -5 };
    const response = await request(app).put(`/api/inventory/${media._id}`).send(invalidData);
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Validation failed');
  });

  it('should return 404 when updating a non-existent media item', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const validData = { stock: 20 };
    const response = await request(app).put(`/api/inventory/${nonExistentId}`).send(validData);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Media not found');
  });

  it('should return 404 when deleting a non-existent media item', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).delete(`/api/inventory/${nonExistentId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Media not found');
  });

  it('should return 404 for checking availability of a non-existent media item', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/inventory/${nonExistentId}/available`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Media not found');
  });

  it('should fail to borrow a non-existent media item', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).post(`/api/inventory/${nonExistentId}/borrow`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Media not found');
  });

  it('should fail to return a non-existent media item', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).post(`/api/inventory/${nonExistentId}/return`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Media not found');
  });

  it('should handle edge case when borrowing reduces stock to zero', async () => {
    const media = await Media.create({ ...sampleMedia, stock: 1 });
    await request(app).post(`/api/inventory/${media._id}/borrow`);
    const response = await request(app).get(`/api/inventory/${media._id}/available`);
    expect(response.status).toBe(200);
    expect(response.body.available).toBe(false);
  });

  it('should handle edge case when returning increases borrowed count to zero', async () => {
    const media = await Media.create({ ...sampleMedia, borrowed: 1 });
    await request(app).post(`/api/inventory/${media._id}/return`);
    const updatedMedia = await Media.findById(media._id);
    expect(updatedMedia.borrowed).toBe(0);
    const response = await request(app).get(`/api/inventory/${media._id}/available`);
    expect(response.status).toBe(200);
    expect(response.body.available).toBe(true);
  });

  it('should not accept invalid ObjectId for endpoints', async () => {
    const invalidId = '123invalidId';
    const responses = await Promise.all([
      request(app).get(`/api/inventory/${invalidId}`),
      request(app).put(`/api/inventory/${invalidId}`).send({ stock: 20 }),
      request(app).delete(`/api/inventory/${invalidId}`),
      request(app).get(`/api/inventory/${invalidId}/available`),
      request(app).post(`/api/inventory/${invalidId}/borrow`),
      request(app).post(`/api/inventory/${invalidId}/return`),
    ]);

    responses.forEach((response) => {
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Cast to ObjectId failed');
    });
  });
});
