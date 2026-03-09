import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { revenueData } from "@/data/mockData";
import { useClients } from "@/contexts/ClientsContext";
import type { ClientRecord } from "@/lib/client-data";
import { Users, Building2, DollarSign, Dumbbell, BedDouble, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function SuperAdminDashboard() {
  const { clients, stats } = useClients();

  const columns = [
    { key: "name", label: "Business Name" },
    { key: "type", label: "Type", render: (item: ClientRecord) => (
      <span className="flex items-center gap-1.5 text-xs font-medium">
        {item.type === "gym" ? <Dumbbell className="h-3.5 w-3.5 text-primary" /> : <BedDouble className="h-3.5 w-3.5 text-accent" />}
        {item.type === "gym" ? "Gym" : "PG"}
      </span>
    )},
    {
      key: "owner",
      label: "Owners / POCs",
      render: (item: ClientRecord) => {
        const extraCount = Math.max(item.pocs.length - 1, 0);
        return extraCount > 0 ? `${item.owner} +${extraCount} more` : item.owner;
      },
    },
    { key: "plan", label: "Plan" },
    { key: "members", label: "Users" },
    { key: "status", label: "Status", render: (item: ClientRecord) => <StatusBadge status={item.status} /> },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Platform Overview" description="Monitor all clients and platform metrics" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatsCard title="Total Clients" value={stats.totalClients} icon={Building2} variant="primary" trend={{ value: 12, label: "vs last month" }} />
        <StatsCard title="Active Subs" value={stats.activeSubscriptions} icon={Users} variant="success" />
        <StatsCard title="Revenue" value={`₹${(stats.revenue / 1000).toFixed(0)}K`} icon={DollarSign} variant="accent" trend={{ value: 8, label: "growth" }} />
        <StatsCard title="Gym Clients" value={stats.gymClients} icon={Dumbbell} variant="primary" />
        <StatsCard title="PG Clients" value={stats.pgClients} icon={BedDouble} variant="warning" />
        <StatsCard title="On Trial" value={stats.trialClients} icon={Clock} variant="default" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5 shadow-card">
          <h3 className="text-sm font-semibold font-display mb-4 text-foreground">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 shadow-card">
          <h3 className="text-sm font-semibold font-display mb-4 text-foreground">Client Distribution</h3>
          <div className="space-y-4 mt-6">
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Gym Clients</span><span className="font-medium">{stats.gymClients}</span></div>
              <div className="h-2 bg-muted rounded-full"><div className="h-2 bg-primary rounded-full" style={{ width: `${(stats.gymClients / stats.totalClients) * 100}%` }} /></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">PG Clients</span><span className="font-medium">{stats.pgClients}</span></div>
              <div className="h-2 bg-muted rounded-full"><div className="h-2 bg-accent rounded-full" style={{ width: `${(stats.pgClients / stats.totalClients) * 100}%` }} /></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Trial</span><span className="font-medium">{stats.trialClients}</span></div>
              <div className="h-2 bg-muted rounded-full"><div className="h-2 bg-warning rounded-full" style={{ width: `${(stats.trialClients / stats.totalClients) * 100}%` }} /></div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold font-display mb-4">All Clients</h3>
      <DataTable columns={columns} data={clients} />
    </div>
  );
}
