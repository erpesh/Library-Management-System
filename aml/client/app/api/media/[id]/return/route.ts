import { mediaApi } from "../../../settings";
import * as z from "zod";
import { getCurrentUser } from "@/lib/auth";


export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {

        const user = await getCurrentUser();
        const id = (await params).id;

        if (!user) {
            return new Response(null, { status: 401 });
        }
        
        const response = await mediaApi.post(`/user/${user?.id}/record/${id}/return`); 
        console.log('response', response.data);
        return new Response(JSON.stringify(response.data), { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 });
        }

        console.error(error);
        return new Response(null, { status: 500 });
    }
}
