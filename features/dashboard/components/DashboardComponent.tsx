"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DashboardComponentProps } from "../types";
import Sidebar from "./Sidebar";
import Header from "./HeaderComponent";
import {useCurrentUser} from "@/features/authentication/services/hooks/useCurrentUser";



export default function DashboardComponent({children}: DashboardComponentProps) {
    const {data:user, isLoading} = useCurrentUser();
  return (

    <div className="flex h-dvh overflow-hidden text-ink">
        <aside className="hidden w-64 shrink-0 lg:block">
            {isLoading ? (
                <p>Loading...</p>
            ) : user ? (
                <Sidebar role={user.role} />
            ) : null}
        </aside>



        <main className="min-h-0 flex-1 overflow-y-auto px-4 pt-1">
            {isLoading ? (
                <p>Loading...</p>
            ) : user ? (
                <Header
                    user={user}


                />
            ) : null}
            {children}</main>
    </div>
  );
}