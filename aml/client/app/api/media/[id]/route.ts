import { inventoryApi } from "../settings";
import * as z from "zod";

// PUT request to update media item by ID
export async function PUT(req: Request) {
    try {
        // Parse JSON data from the request body
        const data = await req.json();

        // Assuming the ID of the item to be updated is passed in the URL, extract it
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        // Make PUT request to inventory API with the provided data
        const response = await inventoryApi.put(`/${id}`, data);

        return new Response(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
        // Handle validation errors if needed
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 });
        }
        console.error(error);
        return new Response(null, { status: 500 });
    }
}
