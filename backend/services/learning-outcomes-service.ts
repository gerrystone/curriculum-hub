
import { and, asc, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import {learningOutcomes} from "@/db/schema/learning_outcomes";
import {corpusDocuments} from "@/db/schema/corpus";

export async function getLearningOutcomesByGradeAndSubject(grade: number, subject: string,) {
    return db
        .select({
            outcomeId: learningOutcomes.outcomeId,
            outcomeText: learningOutcomes.outcomeText,
            sourceEntryId: learningOutcomes.sourceEntryId,
            outcomeIndex: learningOutcomes.outcomeIndex,
        })
        .from(learningOutcomes)
        .innerJoin(
            corpusDocuments,
            eq(
                learningOutcomes.documentId,
                corpusDocuments.documentId,
            ),
        )
        .where(
            and(
                eq(corpusDocuments.grade, grade),
                eq(corpusDocuments.subject, subject),
            ),
        )
        .orderBy(
            asc(learningOutcomes.sourceEntryId),
            asc(learningOutcomes.outcomeIndex),
        );
}
