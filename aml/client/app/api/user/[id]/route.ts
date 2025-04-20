import client from '@/lib/db';
import { ObjectId } from "mongodb"

// Accepts user id and returns user object
export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const userId = new ObjectId(id);

    try {
        const user = await client.db().collection('users').findOne({ _id: userId });
        if (!user) {
            return new Response('User not found', { status: 404 });
        }
        const { password, ...userWithoutPassword } = user;
        return new Response(JSON.stringify(userWithoutPassword), { status: 200 });
    }
    catch (error) {
        console.error('Error fetching user:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}