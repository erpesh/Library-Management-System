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

  it('TC002 should create a new media item', async () => {
    const response = await request(app).post('/api/inventory').send(sampleMedia);
    expect(response.status).toBe(201);
    expect(response.body.title).toBe(sampleMedia.title);

    const mediaInDb = await Media.findOne({ title: sampleMedia.title });
    expect(mediaInDb).toBeTruthy();
    expect(mediaInDb.genre).toBe(sampleMedia.genre);
  });

  it('TC002 should fail to create a new media item with invalid data', async () => {
    const invalidData = { title: '', mediaType: 'unknownType', stock: -1 };
    const response = await request(app).post('/api/inventory').send(invalidData);
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Media validation failed');
  });

  it('TC002 should not allow adding duplicate media items', async () => {
    await Media.create(sampleMedia);
    const response = await request(app).post('/api/inventory').send(sampleMedia);
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Duplicate entry');
  });

  it('TC003 should retrieve all media items', async () => {
    await Media.create(sampleMedia);
    const response = await request(app).get('/api/inventory');
    expect(response.status).toBe(200);
    expect(response.body.mediaItems.length).toBe(1);
    expect(response.body.mediaItems[0].title).toBe(sampleMedia.title);
  });

  it('TC003 should handle search with filters', async () => {
    await Media.create([
      { ...sampleMedia, genre: 'Fiction' },
      { ...sampleMedia, title: 'Another Book', genre: 'Non-Fiction' },
    ]);
    const response = await request(app).get('/api/inventory?genre=Fiction');
    expect(response.status).toBe(200);
    expect(response.body.mediaItems.length).toBe(1);
    expect(response.body.mediaItems[0].genre).toBe('Fiction');
  });

  it('TC003 should return empty results for unmatched search filters', async () => {
    const response = await request(app).get('/api/inventory?genre=NonexistentGenre');
    expect(response.status).toBe(200);
    expect(response.body.mediaItems.length).toBe(0);
  });

  it('TC003 should handle pagination in search results', async () => {
    await Media.create([
      { ...sampleMedia, title: 'Book 1' },
      { ...sampleMedia, title: 'Book 2' },
      { ...sampleMedia, title: 'Book 3' },
    ]);
    const response = await request(app).get('/api/inventory?page=1&perPage=2');
    expect(response.status).toBe(200);
    expect(response.body.mediaItems.length).toBe(2);
  });

  it('TC004 should retrieve a media item by ID', async () => {
    const media = await Media.create(sampleMedia);
    const response = await request(app).get(`/api/inventory/${media._id}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(media.title);
  });

  it('TC004 should return 404 for retrieving a non-existent media item', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/inventory/${nonExistentId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Media not found');
  });

  it('TC005 should update a media item by ID', async () => {
    const media = await Media.create(sampleMedia);
    const updatedData = { stock: 20 };
    const response = await request(app).put(`/api/inventory/${media._id}`).send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body.stock).toBe(updatedData.stock);
  });

  it('TC005 should return 400 when updating a media item negative stock value', async () => {
    const media = await Media.create(sampleMedia);
    const invalidData = { stock: -5 };
    const response = await request(app).put(`/api/inventory/${media._id}`).send(invalidData);
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Validation failed');
  });

  it('TC005 should return 404 when updating a non-existent media item', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const validData = { stock: 20 };
    const response = await request(app).put(`/api/inventory/${nonExistentId}`).send(validData);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Media not found');
  });

  it('TC006 should delete a media item by ID', async () => {
    const media = await Media.create(sampleMedia);
    const response = await request(app).delete(`/api/inventory/${media._id}`);
    expect(response.status).toBe(200);
    const deletedMedia = await Media.findById(media._id);
    expect(deletedMedia).toBeNull();
  });

  it('TC006 should return 404 when deleting a non-existent media item', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).delete(`/api/inventory/${nonExistentId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Media not found');
  });

  it('TC007 should check availability of a media item', async () => {
    const media = await Media.create(sampleMedia);
    const response = await request(app).get(`/api/inventory/${media._id}/available`);
    expect(response.status).toBe(200);
    expect(response.body.available).toBe(true);
  });

  it('TC007 should return 404 for checking availability of a non-existent media item', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/inventory/${nonExistentId}/available`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Media not found');
  });

  it('TC008 should borrow a media item', async () => {
    const media = await Media.create(sampleMedia);
    const response = await request(app).post(`/api/inventory/${media._id}/borrow`);
    expect(response.status).toBe(200);
    const updatedMedia = await Media.findById(media._id);
    expect(updatedMedia.borrowed).toBe(1);
  });

  it('TC008 should not borrow a media item if none available', async () => {
    const media = await Media.create({ ...sampleMedia, stock: 1, borrowed: 1 });
    const response = await request(app).post(`/api/inventory/${media._id}/borrow`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Media not available for borrowing');
  });

  it('TC009 should return a borrowed media item', async () => {
    const media = await Media.create({ ...sampleMedia, borrowed: 1 });
    const response = await request(app).post(`/api/inventory/${media._id}/return`);
    expect(response.status).toBe(200);
    const updatedMedia = await Media.findById(media._id);
    expect(updatedMedia.borrowed).toBe(0);
  });

  it('TC009 should not return a media item if none are borrowed', async () => {
    const media = await Media.create(sampleMedia);
    const response = await request(app).post(`/api/inventory/${media._id}/return`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No borrowed media to return');
  });

  it('TC010 should not accept invalid ObjectId for endpoints', async () => {
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
