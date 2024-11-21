import { mediaApi } from "../../../settings";
import * as z from "zod";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id
        const response = await mediaApi.post(`/user/1/media/${id}`);
        return new Response(JSON.stringify(response.data), { status: 200 })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 });
        }
        console.error(error);
        return new Response(null, { status: 500 });
    }
}
