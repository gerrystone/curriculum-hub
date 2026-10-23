import {LessonPlan} from "@/backend/lib/validation/lesson-plan-validation";

export type LessonPlanSource = {
    chunkId: string;
    documentTitle: string;
    sourceEntryId: string;
    topic: string;
};

export type LessonPlanGenerationSuccess = {
    data: {
        groundingStatus: "grounded";
        plan: LessonPlan;
        sources: LessonPlanSource[];
    };
};
export  type GeneratedLessonPlanProps = {
    data: LessonPlanGenerationSuccess["data"];
    clearPlan: () => void;
};
