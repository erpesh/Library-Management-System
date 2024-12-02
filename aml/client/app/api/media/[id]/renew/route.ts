import { mediaApi } from "../../../settings";
import { getCurrentUser } from "@/lib/auth";
import * as z from "zod";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return new Response(null, { status: 401 });
        }

        // Extract the `id` from params
        const { id } = await params;

        // Ensure the `id` is valid
        if (!id) {
            return new Response(
                JSON.stringify({ error: "ID parameter is required" }),
                { status: 400 }
            );
        }

        // Parse the request body for the payload (newReturnDate)
        const payload = await req.json();

        // Ensure the payload contains a newReturnDate
        const newReturnDate = payload.newReturnDate;
        console.log(newReturnDate);
        if (!newReturnDate) {
            return new Response(
                JSON.stringify({ error: "newReturnDate is required" }),
                { status: 400 }
            );
        }

        // Call the API with the ID and payload
        const response = await mediaApi.post(`/user/${user.id}/record/${id}/renew`, { newReturnDate });

        // Send the response back to the client
        return new Response(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 });
        }
        // Log and handle other errors (e.g., API errors)
        console.error("Error during media renewal:", error);

        // Send a generic 500 response for any server-side issues
        return new Response(
            JSON.stringify({ error: "An error occurred while renewing the media." }),
            { status: 500 }
        );
    }
}
