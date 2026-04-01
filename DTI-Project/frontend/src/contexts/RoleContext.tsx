"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { UserRole } from "@/types";

type RoleContextValue = {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  userName: string;
};

const defaultUserNames: Record<UserRole, string> = {
  supplier: "CleanCo Supplies",
  hotel: "Grand Plaza Hotel",
  admin: "DTI Compliance Desk",
};

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [storedRole, setStoredRole] = useLocalStorage<UserRole | null>("dti-role", null);
  const [storedUserName, setStoredUserName] = useLocalStorage<string>("dti-user-name", "Guest Access");

  const value = useMemo<RoleContextValue>(() => {
    const setRole = (nextRole: UserRole | null) => {
      setStoredRole(nextRole);
      setStoredUserName(nextRole ? defaultUserNames[nextRole] : "Guest Access");
    };

    return {
      role: storedRole,
      setRole,
      userName: storedUserName,
    };
  }, [setStoredRole, setStoredUserName, storedRole, storedUserName]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);

  if (!context) {
    throw new Error("useRole must be used within a RoleProvider.");
  }

  return context;
}