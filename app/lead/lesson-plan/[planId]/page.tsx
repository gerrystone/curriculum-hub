import DashboardComponent from "@/features/dashboard/components/DashboardComponent";
import UpdateLessonPlan from "@/features/curriculum-lead/UpdateLessonPlan";
import {Suspense} from "react";

export default function PlanDetailsPage(){
    return (
        <DashboardComponent>
            <Suspense fallback={<div>Loading...</div>}>
                <UpdateLessonPlan />
            </Suspense>
        </DashboardComponent>
    )
}