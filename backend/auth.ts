
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import {authenticateUser} from "@/backend/lib/authenticate-user";


const credentialsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: {
        strategy: "jwt",
        maxAge: 15 * 60,
    },

    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                const parsed = credentialsSchema.safeParse(credentials);

                if (!parsed.success) {
                    return null;
                }

                const user = await authenticateUser(
                    parsed.data.email,
                    parsed.data.password,
                );

                if (!user) {
                    return null;
                }

                return user;
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub!;
                session.user.role = token.role as
                    | "teacher"
                    | "curriculum_lead";
            }

            return session;
        },
    },
});
