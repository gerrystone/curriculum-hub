
import { and, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import {
    corpusChunks,
    corpusDocuments,
} from "@/db/schema/corpus";
import {LessonPlanContext, RetrievedCurriculumChunk} from "@/backend/services/llm-mock-provider";
import {learningOutcomes} from "@/db/schema/learning_outcomes";


type LessonPlanRetrievalResult = | {
    success: true;
    context: LessonPlanContext;
    chunks: RetrievedCurriculumChunk[];
}
    | {
    success: false;
    error: {
        code:
            | "OUTCOME_NOT_FOUND"
            | "INSUFFICIENT_GROUNDING";
        message: string;
    };
};

export async function retrieveLessonPlanContext(
    outcomeId: string,
): Promise<LessonPlanRetrievalResult> {
    // 1. Retrieve the selected learning outcome and document metadata.
    const [outcome] = await db
        .select({
            outcomeId: learningOutcomes.outcomeId,
            outcomeText: learningOutcomes.outcomeText,
            documentId: learningOutcomes.documentId,
            sourceEntryId: learningOutcomes.sourceEntryId,
            grade: corpusDocuments.grade,
            subject: corpusDocuments.subject,
            documentTitle: corpusDocuments.title,
        })
        .from(learningOutcomes)
        .innerJoin(
            corpusDocuments,
            eq(
                learningOutcomes.documentId,
                corpusDocuments.documentId,
            ),
        )
        .where(eq(learningOutcomes.outcomeId, outcomeId))
        .limit(1);

    if (!outcome) {
        return {
            success: false,
            error: {
                code: "OUTCOME_NOT_FOUND",
                message: "The selected learning outcome was not found.",
            },
        };
    }

    // 2. Retrieve the scheme-of-work entry associated with the outcome.
    const rows = await db
        .select({
            chunkId: corpusChunks.id,
            sourceEntryId: corpusChunks.sourceEntryId,
            topic: corpusChunks.topic,
            textContent: corpusChunks.textContent,
        })
        .from(corpusChunks)
        .where(
            and(
                eq(corpusChunks.documentId, outcome.documentId),
                eq(
                    corpusChunks.sourceEntryId,
                    outcome.sourceEntryId,
                ),
            ),
        );

    if (rows.length === 0) {
        return {
            success: false,
            error: {
                code: "INSUFFICIENT_GROUNDING",
                message:
                    "No curriculum content was found for the selected learning outcome.",
            },
        };
    }

    // 3. Construct the context consumed by the generation service.
    const context: LessonPlanContext = {
        outcomeId: outcome.outcomeId,
        outcomeText: outcome.outcomeText,
        grade: outcome.grade,
        subject: outcome.subject,
    };

    const chunks: RetrievedCurriculumChunk[] = rows.map((row) => ({
        chunkId: row.chunkId,
        documentTitle: outcome.documentTitle,
        sourceEntryId: row.sourceEntryId,
        topic: row.topic,
        textContent: row.textContent,
    }));

    return {
        success: true,
        context,
        chunks,
    };
}
