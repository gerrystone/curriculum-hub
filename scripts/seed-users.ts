
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

const seedUsers = [
    { name: "Alice Wanjiku", email: "alice.lead@example.com", role: "curriculum_lead" },
    { name: "Brian Otieno", email: "brian.lead@example.com", role: "curriculum_lead" },
    { name: "Carol Njeri", email: "carol.teacher@example.com", role: "teacher" },
    { name: "David Kamau", email: "david.teacher@example.com", role: "teacher" },
    { name: "Esther Achieng", email: "esther.teacher@example.com", role: "teacher" },
    { name: "Felix Mwangi", email: "felix.teacher@example.com", role: "teacher" },
    { name: "Grace Muthoni", email: "grace.teacher@example.com", role: "teacher" },
    { name: "Henry Kiptoo", email: "henry.teacher@example.com", role: "teacher" },
    { name: "Irene Atieno", email: "irene.teacher@example.com", role: "teacher" },
    { name: "James Kibet", email: "james.teacher@example.com", role: "teacher" },
] as const;

async function main() {
    if (process.env.NODE_ENV === "production") {
        throw new Error("Refusing to seed users in production.");
    }

    const { db } = await import("../db/drizzle");


    const passwordHash = await hash("P@ssw0rd!", 12);

    let inserted = 0;
    let skipped = 0;

    for (const user of seedUsers) {
        const [existing] = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, user.email))
            .limit(1);

        if (existing) {
            skipped++;
            continue;
        }

        await db.insert(users).values({
            ...user,
            passwordHash,
            accountStatus: "active",
        });

        inserted++;
    }

    console.log(`Users inserted: ${inserted}`);
    console.log(`Users skipped: ${skipped}`);
}

main().catch((error) => {
    console.error("Failed to seed users:", error);
    process.exitCode = 1;
});
