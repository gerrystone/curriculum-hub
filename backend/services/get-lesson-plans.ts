import {and, desc, eq} from "drizzle-orm";
import {db} from "@/db/drizzle";
import {lessonPlans, lessonPlanVersions, users} from "@/db/schema";


export const getLessonPlans = async () => {
    return db
        .select({
            id: lessonPlans.id,
            title: lessonPlans.title,
            grade: lessonPlans.grade,
            subject: lessonPlans.subject,
            topic: lessonPlans.topic,
            status: lessonPlans.status,
            currentVersion: lessonPlans.currentVersion,
            createdBy: users.name,
            createdAt: lessonPlans.createdAt,
            updatedAt: lessonPlans.updatedAt,
            content: lessonPlanVersions.content,
        })
        .from(lessonPlans)
        .innerJoin(users, eq(lessonPlans.createdBy, users.id))
        .leftJoin(
            lessonPlanVersions,
            and(
                eq(lessonPlanVersions.lessonPlanId, lessonPlans.id),
                eq(lessonPlanVersions.version, lessonPlans.currentVersion),
            ),
        )
        .orderBy(desc(lessonPlans.updatedAt));
};