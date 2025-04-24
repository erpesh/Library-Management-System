import * as z from 'zod'
import { inventoryApi } from "../settings";
import { getCurrentUser } from '@/lib/auth';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  mediaType: z.enum(['book', 'cd', 'game'], { required_error: 'Media type is required' }),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  genre: z.string().min(1, 'Genre is required'),
  releaseDate: z.date({
    required_error: "Please select a release date.",
  }),
  imageUrl: z.string().url('Please enter a valid URL for the cover image'),
  stock: z.coerce.number().min(0, 'Stock must be a non-negative number').default(0),
  borrowed: z.coerce.number().min(0).default(0),
  author: z.string().optional(),
  publisher: z.string().optional(),
  platform: z.string().optional(),
  artist: z.string().optional(),
})

export async function POST(
    req: NextRequest
) {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== "admin") {
            return new Response(null, { status: 401 })
        }

        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true });
        if (!token) {
            return new Response(null, { status: 403 });
        }

        const data = await req.json()
        data.releaseDate = new Date(data.releaseDate)
        // Validate the data using Zod
        const parsedData = formSchema.parse(data)

        const response = await inventoryApi.post('/', parsedData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return new Response(JSON.stringify(response.data), { status: 200 })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 })
        }
        console.error(error);
        return new Response(null, { status: 500 })
    }
}

export async function GET(
    req: Request
) {
    try {
        const response = await inventoryApi.get('/');

        return new Response(JSON.stringify(response.data), { status: 200 })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 })
        }
        console.error(error);
        return new Response(null, { status: 500 })
    }
}