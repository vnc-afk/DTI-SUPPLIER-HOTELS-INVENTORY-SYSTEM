"use client";

import { useContext } from "react";
import { InventoryContext } from "./inventory.context";
import type { InventoryContextValue } from "./inventory-context.types";

export function useInventory(): InventoryContextValue {
  const context = useContext(InventoryContext);

  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }

  return context;
}
