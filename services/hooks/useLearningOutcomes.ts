import {useQuery} from "@tanstack/react-query";
import {apiClient} from "@/app/lib/api-client";

export type LearningOutcome =  {
    outcomeId: string;
    outcomeText: string;
}

export  type LearningOutcomesResponse = {
    data: LearningOutcome[];
}
export const useLearningOutcomes = (grade:string, subject: string) => {
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