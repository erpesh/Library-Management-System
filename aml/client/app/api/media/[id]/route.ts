import { inventoryApi } from "../../settings";
import * as z from "zod";

// PUT request to update media item by ID
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
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
        const id = (await params).id
        // Send a DELETE request to remove the media item from the inventory
        const response = await inventoryApi.delete(`/${id}`);
        console.log("Delete Respons", response)
        // If the deletion was successful, return a 200 status
        return new Response(JSON.stringify({ message: 'Media item deleted successfully' }), { status: 200 })

    } catch (error) {
        console.error(error);
        
        // If the error is related to the API or something else, return 500
        return new Response(JSON.stringify({ message: 'Error deleting the media item.' }), { status: 500 });
    }
}
