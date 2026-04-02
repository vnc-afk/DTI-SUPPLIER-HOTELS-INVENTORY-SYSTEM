"use client";

import { useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { UserRole } from "@/types";
import { RoleContextValue, defaultUserNames } from "./role-context.types";
import { RoleContext } from "./role.context";

export function RoleProvider({ children }: { children: ReactNode }) {
  const [storedRole, setStoredRole, roleHydrated] = useLocalStorage<UserRole | null>("dti-role", null);
  const [storedUserName, setStoredUserName, userNameHydrated] = useLocalStorage<string>("dti-user-name", "Guest Access");

  const value = useMemo<RoleContextValue>(() => {
    const setRole = (nextRole: UserRole | null) => {
      setStoredRole(nextRole);
      setStoredUserName(nextRole ? defaultUserNames[nextRole] : "Guest Access");
    };

    return {
      role: storedRole,
      setRole,
      userName: storedUserName,
      isHydrated: roleHydrated && userNameHydrated,
    };
  }, [setStoredRole, setStoredUserName, storedRole, storedUserName, roleHydrated, userNameHydrated]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}