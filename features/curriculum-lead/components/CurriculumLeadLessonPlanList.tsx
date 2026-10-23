"use client"
import {Button} from "@/app/components/Button";
import {useRouter} from "next/navigation";
import {useLessonPlans} from "@/features/lessons/hooks/useCurriculum";

type Status = "draft" | "submitted" | "approved" | "rejected";


const statusStyles: Record<Status, string> = {
    approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    draft: "bg-red-50 text-red-800 ring-red-600/20",
    rejected: "bg-red-50 text-red-800 ring-red-600/20",
    submitted: "bg-green-50 text-green-800 ring-red-600/20",
};

export default function CurriculumLeadLessonPlanList() {
    const router = useRouter();
    const {data:plans, isLoading} = useLessonPlans()
    const plansList = plans?.data ?? []
    return (
        <div className={"space-y-4"}>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ">

                <div className="overflow-x-auto">
                    {
                        isLoading ? "Loading..." :
                            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                                <caption className="sr-only">Content items</caption>
                                <thead className="bg-slate-50">
                                <tr>
                                    {["Topic", "Grade", "Subject", "Date created","Created By", "Status"].map(
                                        (heading) => (
                                            <th
                                                key={heading}
                                                scope="col"
                                                className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700"
                                            >
                                                {heading}
                                            </th>
                                        )
                                    )}
                                </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                {
                                    plansList.length > 0   ? <>
                                        {plansList.map((plan) => (
                                            <tr key={plan.id} className="transition-colors hover:bg-slate-50" >
                                                <th
                                                    scope="row"
                                                    className="whitespace-nowrap px-4 py-3 font-medium text-slate-900"
                                                >
                                                    {plan.title}
                                                </th>
                                                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{plan.grade}</td>
                                                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{plan.subject}</td>
                                                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                                                    <p> {new Date(plan.createdAt).toLocaleDateString()}</p>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{plan.createdBy}</td>
                                                <td className="whitespace-nowrap px-4 py-3">
                  <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[plan.status]}`}
                  >
                    {plan.status.toUpperCase()}
                  </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </> :
                                       <tr>
                                           <td className="whitespace-nowrap px-4 py-3 text-slate-100" colSpan={6}></td>
                                       </tr>
                                }
                                </tbody>
                            </table>
                    }
                </div>
            </div>
        </div>
    );
}