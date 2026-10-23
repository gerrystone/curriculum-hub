import type { ReactNode } from "react";
import {UserRole} from "@/features/authentication/types";

export type NavItem = {
    label: string;
    href: string;
    icon?: ReactNode;
};

export type DashboardUser = {
    name: string;
    role: string;
    avatarUrl?: string;
};

export type SidebarProps = {
    role: UserRole;
};

export type AvatarProps = {
    name: string;
    src?: string;
    size?: number;
};


export type HeaderProps = {
  user: DashboardUser;
};

export type DashboardComponentProps = {
  children: React.ReactNode;
};