import * as z from 'zod'
import { inventoryApi, wishlistApi } from "../../settings";
import { getCurrentUser } from '@/lib/auth';


export async function DELETE(
    req: Request,
    {params }:{params : Promise <{id: string}>},
) {
    try {
        const id = (await params).id;
        const user = await getCurrentUser();
        if (!user) {
            return new Response(null, { status: 401 })
        }
        const response = await wishlistApi.delete(`/user/${user.id}/record/${id}`);
        return new Response(JSON.stringify(response.data), { status: 200 })


    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 })
        }
        console.error(error);
        return new Response(null, { status: 500 })
    }
}