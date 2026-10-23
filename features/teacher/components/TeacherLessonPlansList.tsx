"use client"
import {Button} from "@/app/components/Button";
import {useRouter} from "next/navigation";

type Status = "Published" | "Draft";

type Row = {
    id: string;
    title: string;
    grade: string;
    subject: string;
    topic: string;
    dateCreated: string;
    status: Status;
};

const rows: Row[] = [
    {
        id: "1",
        title: "Introduction to Fractions",
        grade: "Grade 4",
        subject: "Mathematics",
        topic: "Fractions",
        dateCreated: "2026-10-14",
        status: "Published",
    },
    {
        id: "2",
        title: "The Water Cycle",
        grade: "Grade 6",
        subject: "Science",
        topic: "Earth Systems",
        dateCreated: "2026-10-19",
        status: "Draft",
    },
];

const statusStyles: Record<Status, string> = {
    Published: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    Draft: "bg-yellow-50 text-yellow-800 ring-yellow-600/20",
};

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

export default function TeacherLessonPlansList() {
    const router = useRouter();
    return (
        <div className={"space-y-4"}>
            <div className={"flex justify-end"}>
                <Button className={"w-fit"} onClick={()=>router.push("/teacher/create-lesson-plan")}> + Create Lesson Plan</Button>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ">

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                        <caption className="sr-only">Content items</caption>
                        <thead className="bg-slate-50">
                        <tr>
                            {["Title", "Grade", "Subject", "Topic", "Date created", "Status"].map(
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
                        {rows.map((row) => (
                            <tr key={row.id} className="transition-colors hover:bg-slate-50">
                                <th
                                    scope="row"
                                    className="whitespace-nowrap px-4 py-3 font-medium text-slate-900"
                                >
                                    {row.title}
                                </th>
                                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{row.grade}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{row.subject}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{row.topic}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                                    <time dateTime={row.dateCreated}>{formatDate(row.dateCreated)}</time>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                  <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[row.status]}`}
                  >
                    {row.status}
                  </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}