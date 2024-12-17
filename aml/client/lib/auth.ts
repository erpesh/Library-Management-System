import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth/next"
import client from '@/lib/db';
import { AuthOptions } from "next-auth"
import { customEmailTemplate } from "./email-template"
import { createTransport } from 'nodemailer'

export interface User {
    name?: string;
    email: string;
    image?: string;
    id: string;
    role: 'user' | 'admin';
}

export async function getSession() {
    return await getServerSession(authOptions)
}

export async function getCurrentUser(): Promise<User | null> {
    const session = await getSession();

    if (session)
        return session.user as User;

    return null
}

export async function isAdmin() {
    const user = await getCurrentUser()
    return user?.role === "admin"
}

export const authOptions: AuthOptions = {
    providers: [
        EmailProvider({
            server: {
                host: 'smtp.gmail.com',
                port: 587,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            },
            from: process.env.EMAIL_USER,
            sendVerificationRequest: async ({ identifier: email, url, provider, theme }) => {
                const { host } = new URL(url)
                const transport = await createTransport(provider.server)
                const result = await transport.sendMail({
                    to: email,
                    from: provider.from,
                    subject: `Sign in to ${host}`,
                    text: `Sign in to ${host}\n${url}\n\n`,
                    html: customEmailTemplate({
                        url,
                        host,
                        theme,
                    }),
                })
                const failed = result.rejected.concat(result.pending).filter(Boolean)
                if (failed.length) {
                    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
                }
            },
        }),
    ],
    adapter: MongoDBAdapter(client),
    pages: {
        signIn: '/signin',
        verifyRequest: '/signin/verify-request',
    },
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
                const db = client.db();
                const userFromDb = await db.collection("users").findOne({ _id: new ObjectId(user.id) });
                session.user.role = userFromDb?.role || "user";
            }
            return session;
        },
        async signIn({ user, account, profile, email, credentials }) {
            if (email && email.verificationRequest) {
                const db = client.db();
                await db.collection("users").updateOne(
                    { email: user.email },
                    { $set: { role: "admin" } },
                    { upsert: true }
                );
            }
            return true;
        },
    },
}

