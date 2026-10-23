import {useMutation, useQuery} from "@tanstack/react-query";
import {apiClient} from "@/app/lib/api-client";
import {LessonGenerationResponse, LessonPlanGenerationResult} from "@/backend/services/lesson-plan-generation-service";
import {LessonPlanGenerationSuccess} from "@/features/teacher/components/GeneratedLessonPlan";

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