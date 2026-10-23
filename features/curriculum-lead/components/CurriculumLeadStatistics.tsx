import {teacherStatistics} from "@/features/teacher/data";
import StatCard from "@/features/dashboard/components/StatCardComponent";
import {curriculumLeadStatistics} from "@/features/curriculum-lead/data";

export default function CurriculumLeadStatistics(){
    return (
        <div className={"grid grid-cols-3 gap-4"}>
            {
                curriculumLeadStatistics.map((stat)=>(
                    <div key={stat.title}>
                        <StatCard title={stat.title} value={stat.value} />
                    </div>
                ))
            }
        </div>
    )
}