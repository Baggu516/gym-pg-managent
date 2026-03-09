import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { gymStats, gymMembers, gymMembershipData } from "@/data/mockData";
import { Users, UserCheck, Clock, UserMinus, DollarSign, Dumbbell } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";

export default function GymOwnerDashboard() {
  const columns = [
    { key: "name", label: "Name" },
    { key: "plan", label: "Plan" },
    { key: "trainer", label: "Trainer" },
    { key: "expiryDate", label: "Expiry" },
    { key: "amountDue", label: "Due", render: (item: any) => item.amountDue > 0 ? `₹${item.amountDue}` : "—" },
    { key: "status", label: "Status", render: (item: any) => <StatusBadge status={item.status} /> },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Gym Dashboard" description="FitZone Gym — Manage your gym operations">
        <Button className="gradient-primary text-primary-foreground hover:opacity-90">+ Add Member</Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatsCard title="Total Members" value={gymStats.totalMembers} icon={Users} variant="primary" trend={{ value: 5, label: "this month" }} />
        <StatsCard title="Active" value={gymStats.activeMembers} icon={UserCheck} variant="success" />
        <StatsCard title="Pending Payments" value={gymStats.pendingPayments} icon={Clock} variant="warning" />
        <StatsCard title="Dropped" value={gymStats.droppedMembers} icon={UserMinus} variant="destructive" />
        <StatsCard title="Trainers" value={gymStats.totalTrainers} icon={Dumbbell} variant="accent" />
        <StatsCard title="Revenue" value={`₹${(gymStats.monthlyRevenue / 1000).toFixed(0)}K`} icon={DollarSign} variant="primary" />
      </div>

      <div className="rounded-lg border border-border bg-card p-5 shadow-card mb-8">
        <h3 className="text-sm font-semibold font-display mb-4 text-foreground">Membership Trends</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={gymMembershipData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="active" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="new" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="dropped" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h3 className="text-lg font-semibold font-display mb-4">Recent Members</h3>
      <DataTable columns={columns} data={gymMembers} />
    </div>
  );
}
