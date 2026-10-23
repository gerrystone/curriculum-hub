
import {JWTPayload, jwtVerify, SignJWT} from "jose";
import {UserRole} from "@/features/authentication/types";

const ACCESS_TOKEN_TTL_SECONDS = 8 * 60 * 60;

function getAccessTokenSecret() {
    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
        throw new Error(
            "ACCESS_TOKEN_SECRET must contain at least 32 bytes",
        );
    }

    return new TextEncoder().encode(secret);
}

type AuthenticatedUser = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
};

export type AccessTokenPayload = JWTPayload &
    Pick<AuthenticatedUser, "name" | "role"> & {
    sub: AuthenticatedUser["id"];
};


export async function createAccessToken(
    user: AuthenticatedUser,
) {
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + ACCESS_TOKEN_TTL_SECONDS;

    const accessToken = await new SignJWT({
        name: user.name,
        role: user.role,
    })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setSubject(user.id)
        .setIssuer("curriculum-design-hub")
        .setAudience("curriculum-design-hub-api")
        .setIssuedAt(now)
        .setExpirationTime(expiresAt)
        .sign(getAccessTokenSecret());

    return {
        accessToken,
        tokenType: "Bearer" as const,
        expiresIn: ACCESS_TOKEN_TTL_SECONDS,
        expiresAt: new Date(expiresAt * 1000).toISOString(),
    };
}

export async function verifyAccessToken(
    token: string,
): Promise<AccessTokenPayload> {
    const {payload} = await jwtVerify(
        token,
        getAccessTokenSecret(),
        {
            algorithms: ["HS256"],
            issuer: "curriculum-design-hub",
            audience: "curriculum-design-hub-api",
        },
    );

    if (
        typeof payload.sub !== "string" ||
        typeof payload.name !== "string" ||
        (payload.role !== "teacher" &&
            payload.role !== "curriculum_lead")
    ) {
        throw new Error("Invalid access token payload.");
    }

    return payload as AccessTokenPayload;
}