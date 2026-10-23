import {
    LayoutDashboard,
    BookOpen,
    ClipboardList,
    Library,
    CheckCircle,
    Users,
    Settings,
    type LucideIcon,
} from "lucide-react";
import {UserRole} from "@/features/authentication/types";


export interface MenuItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

export const menuItems: Record<UserRole, MenuItem[]> = {
    teacher: [
        {
            label: "Dashboard",
            href: "/teacher",
            icon: LayoutDashboard,
        },
        {
            label: "Learning Outcomes",
            href: "/teacher/learning-outcomes",
            icon: BookOpen,
        },
        {
            label: "My Lesson Plans",
            href: "/teacher/lesson-plans",
            icon: ClipboardList,
        },
        {
            label: "Lesson Library",
            href: "/teacher/lesson-library",
            icon: Library,
        },
    ],

    curriculum_lead: [
        {
            label: "Dashboard",
            href: "/curriculum-lead",
            icon: LayoutDashboard,
        },
        {
            label: "Review Submissions",
            href: "/curriculum-lead/reviews",
            icon: CheckCircle,
        },
        {
            label: "Lesson Library",
            href: "/curriculum-lead/lesson-library",
            icon: Library,
        },
        {
            label: "Teachers",
            href: "/curriculum-lead/teachers",
            icon: Users,
        },
        {
            label: "Settings",
            href: "/curriculum-lead/settings",
            icon: Settings,
        },
    ],
};