import {useMutation, useQuery} from "@tanstack/react-query";
import {apiClient} from "@/app/lib/api-client";
import {LessonPlanGenerationSuccess} from "@/features/teacher/types";
import {LessonPlan} from "@/backend/lib/validation/lesson-plan-validation";
import {LessonPlanGenerationResult} from "@/backend/services/lesson-plan-generation-service";
import {lessonPlanVersions} from "@/db/schema";

export type SaveLessonPlanRequest = {
    plan: LessonPlan;
    topic: string;
    sources: LessonPlanGenerationResult["sources"];
    groundingStatus: "grounded";
};

export type LearningOutcome =  {
    outcomeId: string;
    outcomeText: string;
}

export  type LearningOutcomesResponse = {
    data: LearningOutcome[];
}


export type GenerateLessonPlanRequest = {
    outcomeId: string;
    durationMinutes: number;
};

export type LessonPlanStatus = | "draft" | "submitted" | "approved" | "rejected";
export type LessonPlanListItem = {
    id: string;
    title: string;
    grade: string;
    subject: string;
    topic: string;
    status:LessonPlanStatus
    currentVersion: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    content: LessonPlanGenerationSuccess["data"] | null;
};

export  type  LessonPlanListResponse = {
    data: LessonPlanListItem[];
}

export type LessonPlanDetailsResponse = {
    data: LessonPlanListItem;
}
export const useCurriculum = (grade:string, subject: string) => {
    return useQuery<LearningOutcomesResponse>({
        queryFn:async()=>{
            const response = await apiClient.get<LearningOutcomesResponse>(
                "/curriculum/learning-outcomes",{
                    params:{grade, subject},
                }
            );

            return response.data;
        },
        queryKey:["learning-outcomes", grade, subject],
        enabled:!!grade && !!subject,
    })
}

export const useGenerateLessonPlan = ()=>{
    return useMutation({
        mutationFn:async (request:GenerateLessonPlanRequest)=>{
            const response = await apiClient.post<LessonPlanGenerationSuccess>(
                "/lesson-plans/generate",
                request,
            );

            return response.data;
        }
    })
}

export const useSaveLessonPlan = ()=>{
    return useMutation({
        mutationFn:async (request:SaveLessonPlanRequest)=>{
            const response = await apiClient.post(
                "/lesson-plans/save",
                request,
            );
            return response.data;
        }
    })
}

export const useLessonPlans = ()=>{
    return useQuery<LessonPlanListResponse>({
        queryKey:["lesson-plans"],
        queryFn:async()=>{
            const response = await apiClient.get(
                "/lesson-plans",
            );
            return response.data;
        }
    })
}

export const useLessonPlanDetails = (planId: string)=>{
    return useQuery<LessonPlanDetailsResponse>({
        queryKey:["lesson-plan-details", planId],
        queryFn:async()=>{
            const response = await apiClient.get(
                `/lesson-plans/${planId}`,
            );
            return response.data;
        },
        enabled:!!planId,
    })
}