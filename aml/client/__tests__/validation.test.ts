// @ts-nocheck

import { mediaSchema } from '@/lib/validation';
import { z } from 'zod';

describe('Form Validation Tests (SR1)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // T1: XSS Injection
  test('T1 - should reject media title with script injection', () => {
    const data = {
      title: '<script>alert("XSS")</script>',
      mediaType: 'book',
      description: 'A valid description of the media.',
      genre: 'Fiction',
      releaseDate: new Date(),
      imageUrl: 'https://example.com/image.jpg',
      stock: 10,
      borrowed: 0,
    };

    const result = mediaSchema.safeParse(data);
    expect(result.success).toBe(false);
    expect(result.error.issues.some(issue =>
      issue.message == "Title must not contain script tags"
    )).toBe(true);
  });

  // T2: Missing required fields
  test('T2 - should reject input missing required fields', () => {
    const data = {
      // title is missing
      mediaType: 'cd',
      description: '',
      genre: '',
      releaseDate: null,
      imageUrl: 'not-a-url',
      stock: -5,
      borrowed: -1,
    };

    const result = mediaSchema.safeParse(data);
    expect(result.success).toBe(false);
    expect(result.error.issues.length).toBeGreaterThan(0);
    expect(result.error.issues.some(issue =>
      issue.message.toLowerCase().includes('required')
    )).toBe(true);
  });
});
