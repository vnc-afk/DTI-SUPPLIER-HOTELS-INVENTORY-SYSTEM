"use client";

import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useRole } from "@/contexts/RoleContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { role } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!role) {
      router.replace("/");
    }
  }, [role, router]);

  if (!role) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center border-b bg-card px-4 gap-4 shrink-0">
            <SidebarTrigger className="h-10 w-10" />
            <div className="h-8 w-px bg-border" />
            <h2 className="text-lg font-semibold text-foreground">
              Inventory Monitoring System
            </h2>
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
