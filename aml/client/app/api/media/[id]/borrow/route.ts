import { getCurrentUser } from "@/lib/auth";
import { mediaApi } from "../../../settings";
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

        const id = (await params).id
        const response = await mediaApi.post(`/user/${user.id}/media/${id}`);
        return new Response(JSON.stringify(response.data), { status: 200 })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 });
        }
        console.error(error);
        return new Response(null, { status: 500 });
    }
}