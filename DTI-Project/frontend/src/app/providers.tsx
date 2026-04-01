"use client";

import { type ReactNode } from "react";
import { RoleProvider } from "@/contexts/RoleContext";

export function Providers({ children }: { children: ReactNode }) {
  return <RoleProvider>{children}</RoleProvider>;
}