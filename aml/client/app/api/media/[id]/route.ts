import { inventoryApi } from "../../settings";
import * as z from "zod";
import {getCurrentUser} from '@/lib/auth';

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

        const id = (await params).id
        const response = await inventoryApi.delete(`/${id}`);
        return new Response(JSON.stringify({ message: 'Media item deleted successfully' }), { status: 200 })

    } catch (error) {
        console.error(error);
        
        return new Response(JSON.stringify({ message: 'Error deleting the media item.' }), { status: 500 });
    }
}
