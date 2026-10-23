"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DashboardComponentProps } from "../types";
import Sidebar from "./Sidebar";
import Header from "./HeaderComponent";



export default function DashboardComponent({brand,navItems,user,title,sidebarFooter,children,}: DashboardComponentProps) {


  return (
    // The shell fills the viewport and clips overflow, so only <main> scrolls.
    <div className="flex h-dvh overflow-hidden bg-page text-ink">
      {/* Desktop sidebar: fixed width, part of the flex row, never scrolls with content */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <Sidebar brand={brand} items={navItems} footer={sidebarFooter} />
      </aside>

    

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          user={user}
          title={title}
        
        />
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}