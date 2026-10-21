
import { NextResponse } from "next/server";

import {authenticateUser} from "@/backend/lib/authenticate-user";
import {createAccessToken} from "@/backend/lib/access-token";
import {loginSchema} from "@/features/authentication/validation";

export async function POST(request: Request) {
    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { message: "Invalid request body." },
            { status: 400 },
        );
    }

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { message: "A valid email and password are required." },
            { status: 400 },
        );
    }

    try {
        const user = await authenticateUser(
            parsed.data.email,
            parsed.data.password,
        );

        if (!user) {
            return NextResponse.json(
                { message: "Invalid email or password." },
                { status: 401 },
            );
        }

        const token = await createAccessToken(user);

        return NextResponse.json(
            {
                name: user.name,
                role: user.role,
                accessToken: token.accessToken,
                tokenType: token.tokenType,
                expiresIn: token.expiresIn,
                expiresAt: token.expiresAt,
            },
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store",
                },
            },
        );
    } catch (error) {
        console.error("Login failed:", error);

        return NextResponse.json(
            { message: "An unexpected error occurred." },
            { status: 500 },
        );
    }
}
