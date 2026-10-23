import { and, eq } from "drizzle-orm";
import {db} from "@/db/drizzle";
import {lessonPlans, lessonPlanVersions} from "@/db/schema";

export const getLessonPlanById = async (id: string) => {
    const [lessonPlan] = await db
        .select({
            id: lessonPlans.id,
            title: lessonPlans.title,
            grade: lessonPlans.grade,
            subject: lessonPlans.subject,
            topic: lessonPlans.topic,
            status: lessonPlans.status,
            currentVersion: lessonPlans.currentVersion,
            createdBy: lessonPlans.createdBy,
            createdAt: lessonPlans.createdAt,
            updatedAt: lessonPlans.updatedAt,
            content: lessonPlanVersions.content,
            versionId: lessonPlanVersions.id,
            versionCreatedAt: lessonPlanVersions.createdAt,
        })
        .from(lessonPlans)
        .leftJoin(
            lessonPlanVersions,
            and(
                eq(lessonPlanVersions.lessonPlanId, lessonPlans.id),
                eq(lessonPlanVersions.version, lessonPlans.currentVersion),
            ),
        )
        .where(eq(lessonPlans.id, id))
        .limit(1);

    return lessonPlan ?? null;
};