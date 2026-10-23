"use client"
import {useParams} from "next/navigation";
import {useLessonPlanDetails} from "@/features/lessons/hooks/useCurriculum";
import GeneratedLessonPlan from "@/features/teacher/components/GeneratedLessonPlan";

export default function UpdateLessonPlan() {
    const params = useParams<{ planId: string }>();
    const planId = params.planId;

    const {data:plan, isLoading:isLoading} = useLessonPlanDetails(planId)

    console.log(plan?.data, "plan")
    return  (
            <div>
                {
                    isLoading ? "Loading..." : <>
                        {plan?.data?.content && (
                            <GeneratedLessonPlan data={plan.data.content} viewType={"edit"} status={plan?.data?.status} />
                        )}
                    </>
                }

            </div>
    )
}