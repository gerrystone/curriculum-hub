
import { z } from "zod";

const CitedSectionSchema = z.object({
    sourceChunkIds: z.array(z.string().uuid()).min(1),
});

export const LessonPlanSchema = z.object({
    title: z.string().min(1),
    grade: z.number().int().positive(),
    subject: z.string().min(1),
    durationMinutes: z.number().int().positive(),

    learningOutcome: z.object({
        outcomeId: z.string().uuid(),
        outcomeText: z.string().min(1),
    }),

    objectives: z.array(z.string().min(1)).min(1),
    materials: z.array(z.string().min(1)),

    starter: CitedSectionSchema.extend({
        durationMinutes: z.number().int().positive(),
        teacherActions: z.array(z.string().min(1)).min(1),
        learnerActions: z.array(z.string().min(1)).min(1),
    }),

    mainActivities: z.array(
        CitedSectionSchema.extend({
            title: z.string().min(1),
            durationMinutes: z.number().int().positive(),
            teacherActions: z.array(z.string().min(1)).min(1),
            learnerActions: z.array(z.string().min(1)).min(1),
        }),
    ).min(1),

    checkForUnderstanding: CitedSectionSchema.extend({
        questions: z.array(z.string().min(1)).min(1),
    }),

    conclusion: CitedSectionSchema.extend({
        durationMinutes: z.number().int().positive(),
        teacherActions: z.array(z.string().min(1)).min(1),
    }),

    assessment: CitedSectionSchema.extend({
        method: z.string().min(1),
        successCriteria: z.array(z.string().min(1)).min(1),
    }),

    sourceChunkIds: z.array(z.string().uuid()).min(1),
});

export type LessonPlan = z.infer<typeof LessonPlanSchema>;


export const GenerateLessonPlanRequestSchema = z.object({
    outcomeId: z.string().uuid(),
    durationMinutes: z.number().int().min(10).max(240),
}).strict();
