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
