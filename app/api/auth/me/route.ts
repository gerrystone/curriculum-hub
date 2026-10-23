import { NextResponse } from "next/server";
import {verifyAccessToken} from "@/backend/lib/access-token";
import {getUserById} from "@/backend/services/user-service";


export async function GET(request: Request) {
    const authorization = request.headers.get("Authorization");
    const [scheme, token] = authorization?.split(" ") ?? [];

    if (scheme !== "Bearer" || !token) {
        return NextResponse.json(
            { user: null },
            { status: 401 },
        );
    }

    try {
        const payload = await verifyAccessToken(token);
        const user = await getUserById(payload.sub);

        if (!user || user.accountStatus !== "active") {
            return NextResponse.json(
                { user: null },
                { status: 401 },
            );
        }

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch {
        return NextResponse.json(
            { user: null },
            { status: 401 },
        );
    }
}