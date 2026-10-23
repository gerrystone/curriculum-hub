import CurriculumLeadStatistics from "@/features/curriculum-lead/components/CurriculumLeadStatistics";
import CurriculumLeadLessonPlanList from "@/features/curriculum-lead/components/CurriculumLeadLessonPlanList";

export default function CurriculumLeadMainDashboard(){
    return (
        <div className={"space-y-4"}>
            <CurriculumLeadStatistics />
            <CurriculumLeadLessonPlanList />
        </div>
    )
}