
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import {db} from "@/db/drizzle";

export async function authenticateUser(
    email: string,
    password: string,
) {
    const normalizedEmail = email.trim().toLowerCase();

    const [user] = await db
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
            passwordHash: users.passwordHash,
            role: users.role,
            accountStatus: users.accountStatus,
        })
        .from(users)
        .where(eq(users.email, normalizedEmail))
        .limit(1);

    if (!user || user.accountStatus !== "active") {
        return null;
    }

    const passwordIsValid = await bcrypt.compare(
        password,
        user.passwordHash,
    );

    if (!passwordIsValid) {
        return null;
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
}
