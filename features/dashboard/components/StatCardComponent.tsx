import type { ReactNode } from "react";

type StatCardProps = {
    title: string;
    value: string | number;
    icon?: ReactNode;
    className?: string;
};

export default function StatCard({ title, value, className = "" }: StatCardProps) {
    return (
        <div
            className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
        >
            <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-slate-600">{title}</p>
            </div>

            <p className="mt-3 truncate text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
                {value}
            </p>
        </div>
    );
}