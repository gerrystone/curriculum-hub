
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {generateLessonPlan} from "@/backend/services/lesson-plan-generation-service";
import {GenerateLessonPlanRequestSchema} from "@/backend/lib/validation/lesson-plan-validation";
const ERROR_STATUS: Record<string, number> = {
    OUTCOME_NOT_FOUND: 404,
    INSUFFICIENT_GROUNDING: 422,
    VALIDATION_FAILED: 422,
    GENERATION_PROVIDER_ERROR: 500,
};
export async function POST(request: NextRequest) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Request body must be valid JSON." },
            { status: 400 },
        );
    }

    const parsed = GenerateLessonPlanRequestSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            {
                error: "Invalid lesson-plan request.",
                details: parsed.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            },
            { status: 400 },
        );
    }

    try {
        const result = await generateLessonPlan(
            parsed.data.outcomeId,
            parsed.data.durationMinutes,
        );

        if (!result.success) {
            const status = ERROR_STATUS[result.error.code] ?? 500;

            return NextResponse.json(
                {
                    error: result.error.message,
                    code: result.error.code,

                },
                { status },
            );
        }

        return NextResponse.json(
            { data: result.data },
            { status: 200 },
        );
    } catch (error) {
        console.error("Lesson-plan generation failed:", error);

        return NextResponse.json(
            {
                error: "An unexpected error occurred while generating the lesson plan.",
                code: "INTERNAL_ERROR",
            },
            { status: 500 },
        );
    }
}
