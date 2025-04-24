import { inventoryApi } from "../../settings";
import * as z from "zod";
import {authOptions, getCurrentUser} from '@/lib/auth';
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";

// Get media item by ID
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        const session = await getServerSession(authOptions)
        console.log("Session in GET media item:", session);
        console.log("User in GET media item:", user);
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const id = (await params).id
        const url = user ? `/${id}?userId=${user?.id}` : `/${id}`;
        const response = await inventoryApi.get(url);
        return new Response(JSON.stringify(response.data), { status: 200 })

    } catch (error) {
        console.error(error);
        return new Response(null, { status: 500 });
    }
}

// PUT request to update media item by ID
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== "admin") {
            return new Response(null, { status: 401 })
        }

        const id = (await params).id
        const data = await req.json()
        const response = await inventoryApi.put(`/${id}`, data);
        return new Response(JSON.stringify(response.data), { status: 200 })

    } catch (error) {
        // Handle validation errors if needed
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 });
        }
        console.error(error);
        return new Response(null, { status: 500 });
    }
}

// DELETE API endpoint
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
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

        const id = (await params).id
        const response = await inventoryApi.delete(`/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return new Response(JSON.stringify({ message: 'Media item deleted successfully' }), { status: 200 })

    } catch (error) {
        console.error(error);
        
        return new Response(JSON.stringify({ message: 'Error deleting the media item.' }), { status: 500 });
    }
}
