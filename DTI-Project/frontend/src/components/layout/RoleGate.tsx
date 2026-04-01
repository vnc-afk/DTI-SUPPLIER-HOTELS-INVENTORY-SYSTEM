"use client";

import { type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/contexts/RoleContext";
import type { UserRole } from "@/types";

type RoleGateProps = {
  allowedRoles: readonly UserRole[];
  fallbackPath?: string;
  children: ReactNode;
};

export function RoleGate({ allowedRoles, fallbackPath = "/dashboard", children }: RoleGateProps) {
  const { role } = useRole();
  const router = useRouter();
  const isAllowed = role ? allowedRoles.includes(role) : false;

  useEffect(() => {
    if (!role) {
      router.replace("/");
      return;
    }

    if (!isAllowed) {
      router.replace(fallbackPath);
    }
  }, [fallbackPath, isAllowed, role, router]);

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}