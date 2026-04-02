"use client";

import { createContext } from "react";
import type { InventoryContextValue } from "./inventory-context.types";

export const InventoryContext = createContext<InventoryContextValue | undefined>(undefined);
