import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth/next"
import client from '@/lib/db';

export async function getSession() {
    return await getServerSession(authOptions)
}

export async function getCurrentUser() {
    const session = await getSession()
    return session?.user
}

export async function isAdmin() {
    const user = await getCurrentUser()
    return user?.role === "admin"
}

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
        }),
    ],
    adapter: MongoDBAdapter(client),
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        async session({ session, user }) {
            console.log(session, user)
            if (session.user) {
                session.user.id = user.id;
                const db = client.db();
                const userFromDb = await db.collection("users").findOne({ _id: new ObjectId(user.id) });
                session.user.role = userFromDb?.role || "user";
            }
            return session;
        },
    },
}

