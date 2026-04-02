"use client";

import { createContext } from "react";
import type { RoleContextValue } from "./role-context.types";

export const RoleContext = createContext<RoleContextValue | undefined>(undefined);
