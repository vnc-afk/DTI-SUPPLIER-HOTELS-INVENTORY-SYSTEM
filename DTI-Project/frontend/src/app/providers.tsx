"use client";

import { type ReactNode } from "react";
import { RoleProvider } from "@/contexts/RoleContext";
import { InventoryProvider } from "@/contexts/InventoryContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <RoleProvider>
      <InventoryProvider>{children}</InventoryProvider>
    </RoleProvider>
  );
}