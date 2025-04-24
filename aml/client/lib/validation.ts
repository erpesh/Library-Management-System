import * as z from 'zod';

const safeString = (field: string, minLength = 1) =>
    z.string()
        .min(minLength, `${field} is required`)
        .refine(
            val => !/<\/?script/i.test(val),
            { message: `${field} must not contain script tags` }
        );

const safeUrl = (field: string) =>
    z.string()
        .url(`${field} must be a valid URL`)
        .refine(
            val => !/<\/?script/i.test(val),
            { message: `${field} must not contain script tags` }
        );

export const mediaSchema = z.object({
    title: safeString("Title", 1),
    mediaType: z.enum(['book', 'cd', 'game'], {
        required_error: 'Media type is required'
    }),
    description: safeString("Description", 10),
    genre: safeString("Genre", 1),
    releaseDate: z.date({
        required_error: "Please select a release date."
    }),
    imageUrl: safeUrl("Image URL"),
    stock: z.coerce.number().min(0, 'Stock must be a non-negative number').default(0),
    borrowed: z.coerce.number().min(0, 'Borrowed count must be a non-negative number').default(0),
    author: safeString("Author").optional(),
    publisher: safeString("Publisher").optional(),
    platform: safeString("Platform").optional(),
    artist: safeString("Artist").optional(),
});


