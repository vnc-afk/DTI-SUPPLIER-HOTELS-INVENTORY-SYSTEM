import { cn } from "@/lib/utils";

type Status = "paid" | "pending" | "overdue" | "active" | "inactive" | "low" | "sufficient";

const statusStyles: Record<Status, string> = {
  paid: "bg-success/15 text-success border-success/30",
  active: "bg-success/15 text-success border-success/30",
  sufficient: "bg-success/15 text-success border-success/30",
  pending: "bg-warning/15 text-warning border-warning/30",
  overdue: "bg-destructive/15 text-destructive border-destructive/30",
  inactive: "bg-muted text-muted-foreground border-border",
  low: "bg-destructive/15 text-destructive border-destructive/30",
};

interface StatusBadgeProps {
  status: Status;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border",
        statusStyles[status]
      )}
    >
      {label || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
