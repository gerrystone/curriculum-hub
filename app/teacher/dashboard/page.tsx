import DashboardComponent from "@/features/dashboard/components/DashboardComponent";
import TeacherMainDashboard from "@/features/teacher/components/TeacherMainDashboard";

export default function TeacherDashboard(){
    return(
        <DashboardComponent>
            <TeacherMainDashboard />
        </DashboardComponent>
    )
}