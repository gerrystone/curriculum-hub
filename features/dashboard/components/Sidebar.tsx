"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarProps } from "../types";
import {menuItems} from "@/features/dashboard/sidebar-menu";



export default function Sidebar({role}:SidebarProps) {
    const pathname = usePathname();
    return (
        <div className="flex h-full w-full flex-col bg-stone-100">
            <div className="flex h-16 shrink-0 items-center gap-2 px-5 border-b border-gray-400">
                <h6 className={"font-semibold text-teal-900 text-xl"}>Curriculum Hub</h6>
            </div>

            {/* Only the nav list scrolls if there are more items than fit; never the page */}
            <nav aria-label="Primary" className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-1">
                    {menuItems[role].map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-md px-3 py-2 ${
                                    isActive
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                <Icon size={18} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </ul>
            </nav>

        </div>
    );
}