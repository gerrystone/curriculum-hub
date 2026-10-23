import {LessonPlan, LessonPlanSchema} from "@/backend/lib/validation/lesson-plan-validation";
import {retrieveLessonPlanContext} from "@/backend/services/outcome-retrieval-service";
import {
    generateMockLessonPlan,
    LessonPlanContext,
    RetrievedCurriculumChunk
} from "@/backend/services/llm-mock-provider";


export type LessonPlanValidationResult =
    | {
    valid: true;
    plan: LessonPlan;
}
    | {
    valid: false;
    errors: string[];
};
export type LessonPlanGenerationResult = {
    plan: LessonPlan;
    groundingStatus: "grounded";
    sources: {
        chunkId: string;
        documentTitle: string;
        sourceEntryId: string;
        topic: string;
    }[];
};

export  type LessonGenerationResponse = {
    data: LessonPlanGenerationResult;
}
const MAX_ATTEMPTS = 2;

export async function generateLessonPlan(outcomeId: string, durationMinutes: number,): Promise<LessonPlanGenerationResult> {
    const retrieval = await retrieveLessonPlanContext(outcomeId);

    if (!retrieval.success) {
        throw new Error(retrieval.error.message);
    }

    const { context, chunks } = retrieval;
    let validationErrors: string[] = [];



    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        //For testing generation failure
       /* const generation = {
            success: true as const,
            output: {},
            message: "testing generation failure",
        };*/
        const generation = generateMockLessonPlan({
            context,
            chunks,
            durationMinutes,
        });

        if (!generation.success) {
            throw new Error(generation.message);
        }

        const validation = validateLessonPlan(
            generation.output,
            context,
            durationMinutes,
            chunks,
        );

        if (!validation.valid) {
            validationErrors = validation.errors;
            continue;
        }

        const plan = validation.plan;

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

        const sources = chunks
            .filter((chunk) => citedIds.has(chunk.chunkId))
            .map((chunk) => ({
                chunkId: chunk.chunkId,
                documentTitle: chunk.documentTitle,
                sourceEntryId: chunk.sourceEntryId,
                topic: chunk.topic,
            }));

        if (sources.length === 0) {
            validationErrors = [
                "The plan did not cite retrieved curriculum evidence.",
            ];
            continue;
        }

        return {
            plan,
            groundingStatus: "grounded",
            sources,
        };
    }
    throw new Error(
        `Failed to generate a valid lesson plan after ${MAX_ATTEMPTS} attempts. ${
            validationErrors.join("; ")
        }`,
    );
}


export function validateLessonPlan(
    rawOutput: unknown,
    context: LessonPlanContext,
    requestedDuration: number,
    retrievedChunks: RetrievedCurriculumChunk[],
): LessonPlanValidationResult {
    // 1. Validate the output structure and field types.
    const parsed = LessonPlanSchema.safeParse(rawOutput);

    if (!parsed.success) {
        return {
            valid: false,
            errors: parsed.error.issues.map(
                (issue) =>
                    `${issue.path.join(".")}: ${issue.message}`,
            ),
        };
    }

    const plan = parsed.data;
    const errors: string[] = [];

    // 2. Ensure the plan matches the requested curriculum outcome.
    if (plan.grade !== context.grade) {
        errors.push("Plan grade does not match the selected outcome.");
    }

    if (plan.subject !== context.subject) {
        errors.push("Plan subject does not match the selected outcome.");
    }

    if (
        plan.learningOutcome.outcomeId !== context.outcomeId ||
        plan.learningOutcome.outcomeText !== context.outcomeText
    ) {
        errors.push(
            "Plan learning outcome does not match the selected outcome.",
        );
    }

    if (plan.durationMinutes !== requestedDuration) {
        errors.push(
            "Plan duration does not match the requested duration.",
        );
    }

    // 3. Verify the lesson timings add up exactly.
    const scheduledMinutes =
        plan.starter.durationMinutes +
        plan.mainActivities.reduce(
            (total, activity) => total + activity.durationMinutes,
            0,
        ) +
        plan.conclusion.durationMinutes;

    if (scheduledMinutes !== requestedDuration) {
        errors.push(
            `Scheduled activities total ${scheduledMinutes} minutes; expected ${requestedDuration}.`,
        );
    }

    // 4. Ensure every citation references retrieved curriculum evidence.
    const availableChunkIds = new Set(
        retrievedChunks.map((chunk) => chunk.chunkId),
    );

    const citedChunkIds = [
        ...plan.sourceChunkIds,
        ...plan.starter.sourceChunkIds,
        ...plan.mainActivities.flatMap(
            (activity) => activity.sourceChunkIds,
        ),
        ...plan.checkForUnderstanding.sourceChunkIds,
        ...plan.conclusion.sourceChunkIds,
        ...plan.assessment.sourceChunkIds,
    ];

    const invalidChunkIds = [
        ...new Set(
            citedChunkIds.filter(
                (chunkId) => !availableChunkIds.has(chunkId),
            ),
        ),
    ];

    if (invalidChunkIds.length > 0) {
        errors.push(
            `Citations reference chunks that were not retrieved: ${invalidChunkIds.join(", ")}`,
        );
    }

    if (errors.length > 0) {
        return {
            valid: false,
            errors,
        };
    }

    return {
        valid: true,
        plan,
    };
}