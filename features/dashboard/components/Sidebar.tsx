"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarProps } from "../types";



export default function Sidebar({ brand, items, footer, onNavigate }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-full flex-col bg-field border-r border-line">
            <div className="flex h-16 shrink-0 items-center gap-2 px-5 border-b border-line">
                <span className="inline-block h-6 w-6 rounded-md bg-brand" />
                <span className="font-display text-lg font-bold tracking-tight">{brand}</span>
            </div>

            {/* Only the nav list scrolls if there are more items than fit; never the page */}
            <nav aria-label="Primary" className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-1">
                    {items.map((item) => {
                        const active = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={onNavigate}
                                    aria-current={active ? "page" : undefined}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                                        active
                                            ? "bg-brand text-onbrand"
                                            : "text-mute hover:bg-page hover:text-ink"
                                    }`}
                                >
                                    {item.icon && (
                                        <span className="h-5 w-5 shrink-0" aria-hidden="true">
                      {item.icon}
                    </span>
                                    )}
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {footer && <div className="shrink-0 border-t border-line p-4">{footer}</div>}
        </div>
    );
}