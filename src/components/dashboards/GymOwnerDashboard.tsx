import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { useStaff } from "@/contexts/StaffContext";
import { gymStats, gymMembershipData } from "@/data/mockData";
import { Users, UserCheck, Clock, UserMinus, DollarSign, Dumbbell } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function GymOwnerDashboard() {
  const { trainers } = useStaff();
  return (
    <div className="animate-fade-in">
      <PageHeader title="Gym Dashboard" description="FitZone Gym — Manage your gym operations" />

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

      <h3 className="text-lg font-semibold font-display mb-4">Members per trainer</h3>
      <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
        <div className="grid gap-0">
          {trainers.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-2">
                  <Dumbbell className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.specialization}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold font-display text-primary">{t.assignedMembers}</p>
                <p className="text-xs text-muted-foreground">members assigned</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
