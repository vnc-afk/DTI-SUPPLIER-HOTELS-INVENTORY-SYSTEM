import type { UserRole } from "@/types";

export type RoleContextValue = {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  userName: string;
  isHydrated: boolean;
};

export const defaultUserNames: Record<UserRole, string> = {
  supplier: "CleanCo Supplies",
  hotel: "Grand Plaza Hotel",
  admin: "DTI Compliance Desk",
};
