
import { z } from "zod";

const metadataSchema = z.object({
    documentId: z.string().trim().min(1).max(255),
    title: z.string().trim().min(1),
    subject: z.string().trim().min(1).max(150),
    grade: z.number().int().min(1).max(13),
    version: z.number().int().positive(),
});

const schemeEntrySchema = z.object({
    entryId: z.string().min(1),
    week: z.number().int().positive(),
    topic: z.string().min(1),
    durationMinutes: z.number().positive(),
    priorKnowledge: z.array(z.string()),
    learningOutcomes: z.array(z.string().min(1)).min(1),
    keyConcepts: z.array(z.string()),
    learningActivities: z.array(z.string()),
    resources: z.array(z.string()),
    assessment: z.string(),
    teacherNotes: z.string(),
}).passthrough();

const assessmentItemSchema = z.object({
    itemId: z.string().min(1),
    topic: z.string().min(1),
    itemType: z.string().min(1),
    difficulty: z.string().min(1),
    question: z.string().min(1),
    expectedAnswer: z.string().min(1),
    marks: z.number().int().positive(),
    markingGuide: z.array(z.string()),
    misconceptionTested: z.string().optional(),
}).passthrough();

const learningOutcomeSchema = z.object({
    outcomeId: z.string().min(1),
    topic: z.string().min(1),
    statement: z.string().min(1),
}).passthrough();

export const corpusDocumentSchema = z.discriminatedUnion(
    "documentType",
    [
        metadataSchema.extend({
            documentType: z.literal("scheme_of_work"),
            entries: z.array(schemeEntrySchema).min(1),
        }),

        metadataSchema.extend({
            documentType: z.literal("sample_assessment"),
            items: z.array(assessmentItemSchema).min(1),
        }),

        metadataSchema.extend({
            documentType: z.literal("learning_outcomes"),
            outcomes: z.array(learningOutcomeSchema).min(1),
        }),
    ],
);

export type CorpusDocument = z.infer<typeof corpusDocumentSchema>;
