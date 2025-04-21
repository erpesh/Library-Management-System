import * as z from 'zod'
import { inventoryApi } from "../settings";
import { getCurrentUser } from '@/lib/auth';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

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
        const response = await inventoryApi.post('/', data, {
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