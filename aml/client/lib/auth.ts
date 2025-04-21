import EmailProvider from "next-auth/providers/email"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth/next"
import client from '@/lib/db';
import { AuthOptions } from "next-auth"
import { customEmailTemplate } from "./email-template"
import { createTransport } from 'nodemailer'
import jwt from "jsonwebtoken";

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
    console.log("Session in getCurrentUser:", session);

    if (session)
        return session.user as User;

    return null
}

export async function isAdmin() {
    const user = await getCurrentUser()
    return user?.role === "admin"
}

export const authOptions: AuthOptions = {
    session: {
        strategy: "jwt",
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        encode: async ({ token, secret }) => {
            return jwt.sign(token, secret, { algorithm: "HS256" });
        },
        decode: async ({ token, secret }) => {
            return jwt.verify(token, secret);
        },
    },
    providers: [
        EmailProvider({
            server: {
                host: "sandbox.smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: "dc6b52205ab3bf",
                    pass: "81bb2d29ce6d0e"
                }
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
        async jwt({ token, user }) {
            // Called on sign-in and whenever the token is updated
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.role = user.role || "user"; // You can also fetch from DB here if needed
            }

            // Optional: enrich token with DB role if not already set
            if (!token.role) {
                const db = client.db();
                const userFromDb = await db.collection("users").findOne({ _id: new ObjectId(token.id as string) });
                token.role = userFromDb?.role || "user";
            }

            return token;
        },

        async session({ session, token }) {
            // Pass token data into session
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.role = token.role as "user" | "admin";
            }
            return session;
        },

        async signIn({ user, email }) {
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
    }
}

