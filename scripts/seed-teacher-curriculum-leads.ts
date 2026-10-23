
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { eq } from "drizzle-orm";
import { teacherCurriculumLeads, users } from "@/db/schema";


async function main() {
    if (process.env.NODE_ENV === "production") {
        throw new Error("Refusing to seed assignments in production.");
    }
    const { db } = await import("../db/drizzle");
    
    const curriculumLeadEmails = [
        "alice.lead@example.com",
        "brian.lead@example.com",
    ];

    const teacherEmails = [
        "carol.teacher@example.com",
        "david.teacher@example.com",
        "esther.teacher@example.com",
        "felix.teacher@example.com",
        "grace.teacher@example.com",
        "henry.teacher@example.com",
        "irene.teacher@example.com",
        "james.teacher@example.com",
    ];

    async function getUser(email: string, expectedRole: string) {
        const [user] = await db
            .select({
                id: users.id,
                role: users.role,
            })
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (!user) {
            throw new Error(`User not found: ${email}. Seed users first.`);
        }

        if (user.role !== expectedRole) {
            throw new Error(
                `Unexpected role for ${email}: ${user.role}. Expected ${expectedRole}.`,
            );
        }

        return user;
    }

    const leadUsers = await Promise.all(
        curriculumLeadEmails.map((email) =>
            getUser(email, "curriculum_lead"),
        ),
    );

    const teacherUsers = await Promise.all(
        teacherEmails.map((email) => getUser(email, "teacher")),
    );

    let inserted = 0;
    let skipped = 0;

    for (let index = 0; index < teacherUsers.length; index++) {
        const teacher = teacherUsers[index];
        const curriculumLead = leadUsers[index < 4 ? 0 : 1];

        const [existing] = await db
            .select({
                curriculumLeadId:
                    teacherCurriculumLeads.curriculumLeadId,
            })
            .from(teacherCurriculumLeads)
            .where(
                eq(teacherCurriculumLeads.teacherId, teacher.id),
            )
            .limit(1);

        if (existing) {
            if (existing.curriculumLeadId !== curriculumLead.id) {
                throw new Error(
                    `Teacher ${teacherEmails[index]} is already assigned to a different curriculum lead.`,
                );
            }

            skipped++;
            continue;
        }

        await db.insert(teacherCurriculumLeads).values({
            teacherId: teacher.id,
            curriculumLeadId: curriculumLead.id,
        });

        inserted++;
    }

    console.log(`Assignments inserted: ${inserted}`);
    console.log(`Assignments skipped: ${skipped}`);
}

main().catch((error) => {
    console.error("Failed to seed teacher-curriculum-lead assignments:", error);
    process.exitCode = 1;
});
