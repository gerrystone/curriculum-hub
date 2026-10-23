import {teacherStatistics} from "@/features/teacher/data";
import StatCard from "@/features/dashboard/components/StatCardComponent";

export default function TeacherStatistics(){
    return (
        <div className={"grid grid-cols-3 gap-4"}>
            {
                teacherStatistics.map((stat)=>(
                   <div key={stat.title}>
                       <StatCard title={stat.title} value={stat.value} />
                   </div>
                ))
            }
        </div>
    )
}