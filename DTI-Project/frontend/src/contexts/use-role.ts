"use client";

import { useContext } from "react";
import { RoleContext } from "./role.context";
import type { RoleContextValue } from "./role-context.types";

export function useRole(): RoleContextValue {
  const context = useContext(RoleContext);

  if (!context) {
    throw new Error("useRole must be used within a RoleProvider.");
  }

  return context;
}
