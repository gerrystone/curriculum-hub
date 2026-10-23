
import { NextRequest, NextResponse } from "next/server";

import {verifyAccessToken} from "@/backend/lib/access-token";
import {getUserById} from "@/backend/services/user-service";
import {saveLessonPlan} from "@/backend/services/save-lesson-plan";
import {LessonPlan} from "@/backend/lib/validation/lesson-plan-validation";
import {LessonPlanGenerationResult} from "@/backend/services/lesson-plan-generation-service";

type SaveLessonPlanBodyRequest = {
    plan: LessonPlan;
    topic: string;
    sources: LessonPlanGenerationResult["sources"];
    groundingStatus: "grounded";
};

export async function POST(request: NextRequest) {
    try {
        const authorization = request.headers.get("authorization");
        const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

        if (!token) {
            return NextResponse.json(
                { message: "Authentication required." },
                { status: 401 },
            );
        }

        let payload;

        try {
            payload = await verifyAccessToken(token);
        } catch {
            return NextResponse.json(
                { message: "Invalid or expired access token." },
                { status: 401 },
            );
        }

        const user = await getUserById(payload.sub);

        if (!user) {
            return NextResponse.json(
                { message: "User not found." },
                { status: 401 },
            );
        }

        if (user.role !== "teacher") {
            return NextResponse.json(
                { message: "Only teachers can save lesson plans." },
                { status: 403 },
            );
        }

        const body:SaveLessonPlanBodyRequest = await request.json();

        const { plan, topic, sources, groundingStatus } = body;

        const sourceIds = new Set(sources.map((source) => source.chunkId));

        const citedIds = new Set([
            ...plan.sourceChunkIds,
            ...plan.starter.sourceChunkIds,
            ...plan.mainActivities.flatMap(
                (activity) => activity.sourceChunkIds,
            ),
            ...plan.checkForUnderstanding.sourceChunkIds,
            ...plan.conclusion.sourceChunkIds,
            ...plan.assessment.sourceChunkIds,
        ]);

        if ([...citedIds].some((id) => !sourceIds.has(id))) {
            return NextResponse.json(
                {
                    message:
                        "Some cited curriculum sources are missing from the source list.",
                },
                { status: 400 },
            );
        }

        const saved = await saveLessonPlan({
            plan,
            sources,
            createdBy: user.id,
            topic,
            groundingStatus
        });

        return NextResponse.json(
            {
                message: "Lesson plan saved successfully.",
                lessonPlanId: saved.lessonPlanId,
                versionId: saved.versionId,
                version: saved.version,
            },
            { status: 201 },
        );
    } catch (error: unknown) {
        console.error("Failed to save lesson plan:", error);

        return NextResponse.json(
            { message: "Failed to save lesson plan. Please try again." },
            { status: 500 },
        );
    }
}
