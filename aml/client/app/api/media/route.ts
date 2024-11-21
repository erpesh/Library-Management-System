import { formSchema } from "@/app/page";
import * as z from 'zod'
import { inventoryApi } from "../settings";

export async function POST(
    req: Request
) {
    try {
        const data = await req.json()
        const response = await inventoryApi.post('/', data);
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