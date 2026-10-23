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

    <div className="flex h-dvh overflow-hidden bg-page text-ink">
        <aside className="hidden w-64 shrink-0 lg:block">
            {isLoading ? (
                <p>Loading...</p>
            ) : user ? (
                <Sidebar role={user.role} />
            ) : null}
        </aside>

    

      <div className="flex min-w-0 flex-1 flex-col">
          {isLoading ? (
              <p>Loading...</p>
          ) : user ? (
              <Header
                  user={user}
                  title={"Curriculum Hub"}

              />
          ) : null}

        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}