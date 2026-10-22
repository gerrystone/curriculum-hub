import {LessonPlanSchema} from "@/backend/lib/validation/lesson-plan-validation";


export type LessonPlanContext = {
    outcomeId: string;
    outcomeText: string;
    grade: number;
    subject: string;
};

export type RetrievedCurriculumChunk = {
    chunkId: string;
    documentTitle: string;
    sourceEntryId: string;
    topic: string;
    textContent: string;
};

type MockGenerationInput = {
    context: LessonPlanContext;
    chunks: RetrievedCurriculumChunk[];
    durationMinutes: number;
};

type MockGenerationResult =
    | { success: true; output: unknown }
    | { success: false; message: string };

export function generateMockLessonPlan({context,chunks,durationMinutes,}: MockGenerationInput): MockGenerationResult {
    if (chunks.length === 0) {
        return {
            success: false,
            message: "No curriculum evidence is available.",
        };
    }

    const starterMinutes = Math.floor(durationMinutes * 0.2);
    const conclusionMinutes = Math.floor(durationMinutes * 0.15);
    const mainMinutes =
        durationMinutes - starterMinutes - conclusionMinutes;

    const citedChunkIds = [chunks[0].chunkId];
    const topic = chunks[0].topic || context.subject;
    const outcome = context.outcomeText;

    const output = {
        title: `${topic}: Lesson Plan`,
        grade: context.grade,
        subject: context.subject,
        durationMinutes,

        learningOutcome: {
            outcomeId: context.outcomeId,
            outcomeText: context.outcomeText,
        },

        objectives: [
            `Explain key concepts related to ${outcome}`,
            `Apply the concepts related to ${outcome} in a learning activity`,
            "Demonstrate understanding through a short assessment",
        ],

        materials: [
            "Chalkboard or whiteboard",
            "Learner notebooks",
            `Teaching materials related to ${topic}`,
        ],

        starter: {
            durationMinutes: starterMinutes,
            teacherActions: [
                `Introduce ${topic} and connect it to learners' prior knowledge`,
                "Ask learners an opening question about the topic",
            ],
            learnerActions: [
                "Share prior knowledge and respond to the opening question",
            ],
            sourceChunkIds: citedChunkIds,
        },

        mainActivities: [
            {
                title: `Explore ${topic}`,
                durationMinutes: mainMinutes,
                teacherActions: [
                    `Explain concepts relevant to the learning outcome: ${outcome}`,
                    "Demonstrate an example using the curriculum context",
                    "Guide learners through a practice activity",
                ],
                learnerActions: [
                    "Discuss the key concepts in pairs or small groups",
                    "Complete an activity applying the concepts",
                    "Share answers and explain their reasoning",
                ],
                sourceChunkIds: citedChunkIds,
            },
        ],

        checkForUnderstanding: {
            questions: [
                `What are the key ideas related to ${outcome}?`,
                "How could you apply what you have learned?",
            ],
            sourceChunkIds: citedChunkIds,
        },

        conclusion: {
            durationMinutes: conclusionMinutes,
            teacherActions: [
                "Summarise the key ideas and revisit the lesson objectives",
                "Address misunderstandings identified during the lesson",
            ],
            sourceChunkIds: citedChunkIds,
        },

        assessment: {
            method: "Short written or oral exit assessment",
            successCriteria: [
                "Learner explains a key concept correctly",
                "Learner applies a concept to an appropriate example",
            ],
            sourceChunkIds: citedChunkIds,
        },

        sourceChunkIds: chunks.map((chunk) => chunk.chunkId),
    };

    // Keep the mock subject to the same output schema as real generation.
    const parsed = LessonPlanSchema.safeParse(output);

    if (!parsed.success) {
        return {
            success: false,
            message: "Mock lesson plan did not satisfy the output schema.",
        };
    }

    return {
        success: true,
        output: parsed.data,
    };
}
