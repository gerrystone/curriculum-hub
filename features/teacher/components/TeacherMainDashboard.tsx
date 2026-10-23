import TeacherStatistics from "@/features/teacher/components/TeacherStatistics";
import TeacherLessonPlansList from "@/features/teacher/components/TeacherLessonPlansList";

export default function TeacherMainDashboard(){

    return (
        <div className={"space-y-4"}>
            <TeacherStatistics />
            <TeacherLessonPlansList />
        </div>
    )
}