import {LessonPlanGenerationResult} from "@/backend/services/lesson-plan-generation-service";
import {db} from "@/db/drizzle";
import {lessonPlans, lessonPlanVersions} from "@/db/schema";
import {LessonPlan} from "@/backend/lib/validation/lesson-plan-validation";

export type SaveLessonPlanAPIRequest = {
    plan: LessonPlan;
    topic: string;
    sources: LessonPlanGenerationResult["sources"];
    groundingStatus: "grounded";
    createdBy: string;
};

export async function saveLessonPlan({plan, createdBy, topic, sources, groundingStatus}: SaveLessonPlanAPIRequest) {


    if (groundingStatus !== "grounded") {
        throw new Error("Only grounded lesson plans can be saved.");
    }

    return db.transaction(async (tx) => {
        const [savedPlan] = await tx
            .insert(lessonPlans)
            .values({
                title: plan.title,
                createdBy,
                grade: String(plan.grade),
                subject: plan.subject,
                topic,
                currentVersion: 1,
                status: "draft",
            })
            .returning({
                id: lessonPlans.id,
            });

        const [savedVersion] = await tx
            .insert(lessonPlanVersions)
            .values({
                lessonPlanId: savedPlan.id,
                version: 1,
                content: {
                    plan,
                    groundingStatus,
                    sources,
                },
                createdBy,
                status: "draft",
            })
            .returning({
                id: lessonPlanVersions.id,
                version: lessonPlanVersions.version,
            });

        return {
            lessonPlanId: savedPlan.id,
            versionId: savedVersion.id,
            version: savedVersion.version,
        };
    });
}
