
import { describe, expect, it } from "vitest";
import {LessonPlanSchema} from "@/backend/lib/validation/lesson-plan-validation";

const outcomeId = "550e8400-e29b-41d4-a716-446655440000";
const chunkId = "550e8400-e29b-41d4-a716-446655440001";

const validLessonPlan = {
    title: "Introduction to Electrical Circuits",
    grade: 8,
    subject: "Integrated Science",
    durationMinutes: 40,

    learningOutcome: {
        outcomeId,
        outcomeText: "Explain how electrical circuits work",
    },

    objectives: [
        "Identify the components of a simple circuit",
    ],
    materials: ["Battery", "Bulb", "Connecting wires"],

    starter: {
        sourceChunkIds: [chunkId],
        durationMinutes: 5,
        teacherActions: ["Introduce a simple circuit"],
        learnerActions: ["Observe the circuit"],
    },

    mainActivities: [
        {
            title: "Build a simple circuit",
            durationMinutes: 25,
            sourceChunkIds: [chunkId],
            teacherActions: ["Demonstrate the connections"],
            learnerActions: ["Build the circuit in groups"],
        },
    ],

    checkForUnderstanding: {
        sourceChunkIds: [chunkId],
        questions: ["What happens when the circuit is open?"],
    },

    conclusion: {
        sourceChunkIds: [chunkId],
        durationMinutes: 5,
        teacherActions: ["Summarise the lesson"],
    },

    assessment: {
        sourceChunkIds: [chunkId],
        method: "Practical demonstration",
        successCriteria: ["Construct a working circuit"],
    },

    sourceChunkIds: [chunkId],
};

describe("lessonPlanSchema", () => {
    it("accepts a valid lesson plan", () => {
        const result = LessonPlanSchema.safeParse(validLessonPlan);

        expect(result.success).toBe(true);
    });

    it("rejects a lesson plan without a title", () => {
        const result = LessonPlanSchema.safeParse({
            ...validLessonPlan,
            title: "",
        });

        expect(result.success).toBe(false);
    });

    it("rejects an invalid lesson duration", () => {
        const result = LessonPlanSchema.safeParse({
            ...validLessonPlan,
            durationMinutes: -10,
        });

        expect(result.success).toBe(false);
    });

    it("rejects a lesson plan with incorrectly typed objectives", () => {
        const result = LessonPlanSchema.safeParse({
            ...validLessonPlan,
            objectives: "Identify circuit components",
        });

        expect(result.success).toBe(false);
    });
});
