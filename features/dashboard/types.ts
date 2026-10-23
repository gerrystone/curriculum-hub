import type { ReactNode } from "react";

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
    brand: string;
    items: NavItem[];
    footer?: React.ReactNode;
    onNavigate?: () => void;
};

export type AvatarProps = {
    name: string;
    src?: string;
    size?: number;
};


export type HeaderProps = {
  user: DashboardUser;
  title?: string;
};

export type DashboardComponentProps = {
  brand: string;
  navItems: NavItem[];
  user: DashboardUser;
  title?: string;
  sidebarFooter?: React.ReactNode;
  children: React.ReactNode;
};