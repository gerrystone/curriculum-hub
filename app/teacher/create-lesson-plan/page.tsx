import DashboardComponent from "@/features/dashboard/components/DashboardComponent";
import GenerateLessonPlan from "@/features/teacher/components/GenerateLessonPlan";

export default function CreateLessonPlanPage(){
    return (
        <DashboardComponent>
            <GenerateLessonPlan />
        </DashboardComponent>
    )
}