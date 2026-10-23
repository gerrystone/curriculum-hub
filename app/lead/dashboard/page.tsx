import DashboardComponent from "@/features/dashboard/components/DashboardComponent";
import CurriculumLeadMainDashboard from "@/features/curriculum-lead/components/CurriculumLeadMainDashboard";

export default function CurriculumLeadDashboard(){
    return(
        <DashboardComponent>
            <CurriculumLeadMainDashboard />
        </DashboardComponent>
    )
}