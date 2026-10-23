import { eq } from "drizzle-orm";
import {db} from "@/db/drizzle";
import {users} from "@/db/schema";

export async function getUserById(id: string) {
    const [user] = await db
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            accountStatus: users.accountStatus,
        })
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

    return user ?? null;
}