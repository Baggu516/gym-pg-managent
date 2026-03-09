import { Badge } from "@/components/ui/badge";

type Status = "active" | "paid" | "occupied" | "pending" | "expiring" | "trial" | "overdue" | "dropped" | "vacant";

const statusConfig: Record<Status, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-success/15 text-success border-success/30 hover:bg-success/20" },
  paid: { label: "Paid", className: "bg-success/15 text-success border-success/30 hover:bg-success/20" },
  occupied: { label: "Occupied", className: "bg-primary/15 text-primary border-primary/30 hover:bg-primary/20" },
  pending: { label: "Pending", className: "bg-warning/15 text-warning border-warning/30 hover:bg-warning/20" },
  expiring: { label: "Expiring", className: "bg-warning/15 text-warning border-warning/30 hover:bg-warning/20" },
  trial: { label: "Trial", className: "bg-accent/15 text-accent border-accent/30 hover:bg-accent/20" },
  overdue: { label: "Overdue", className: "bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20" },
  dropped: { label: "Dropped", className: "bg-muted text-muted-foreground border-muted hover:bg-muted" },
  vacant: { label: "Vacant", className: "bg-muted text-muted-foreground border-muted hover:bg-muted" },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status] || statusConfig.active;
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}
