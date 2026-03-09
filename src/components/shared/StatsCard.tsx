import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  variant?: "default" | "primary" | "success" | "warning" | "destructive" | "accent";
}

const variantStyles: Record<string, string> = {
  default: "bg-card border border-border",
  primary: "bg-primary/10 border border-primary/20",
  success: "bg-success/10 border border-success/20",
  warning: "bg-warning/10 border border-warning/20",
  destructive: "bg-destructive/10 border border-destructive/20",
  accent: "bg-accent/10 border border-accent/20",
};

const iconStyles: Record<string, string> = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/20 text-primary",
  success: "bg-success/20 text-success",
  warning: "bg-warning/20 text-warning",
  destructive: "bg-destructive/20 text-destructive",
  accent: "bg-accent/20 text-accent",
};

export function StatsCard({ title, value, icon: Icon, trend, variant = "default" }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg p-5 ${variantStyles[variant]} shadow-card`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold font-display text-foreground">{value}</p>
          {trend && (
            <p className={`mt-1 text-xs font-medium ${trend.value >= 0 ? "text-success" : "text-destructive"}`}>
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={`rounded-lg p-3 ${iconStyles[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
