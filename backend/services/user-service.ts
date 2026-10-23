import { eq } from "drizzle-orm";
import {db} from "@/db/drizzle";
import {users} from "@/db/schema";
import {UserRole} from "@/features/authentication/types";

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
export function hasRequiredRole(actualRole: UserRole, allowedRoles: UserRole[],): boolean {
    return allowedRoles.includes(actualRole);
}