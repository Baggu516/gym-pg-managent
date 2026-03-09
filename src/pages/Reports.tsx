import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { useAuth } from "@/contexts/AuthContext";
import { gymStats, pgStats, revenueData, gymMembershipData, pgOccupancyData } from "@/data/mockData";
import { DollarSign, TrendingUp, Users, BarChart3 } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Reports() {
  const { user } = useAuth();
  const isGym = user?.businessType === "gym";
  const isSuperAdmin = user?.role === "super_admin";

  return (
    <div className="animate-fade-in">
      <PageHeader title="Reports & Analytics" description="Comprehensive business insights" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Revenue" value={isSuperAdmin ? "₹485K" : isGym ? "₹125K" : "₹82K"} icon={DollarSign} variant="primary" trend={{ value: 12, label: "vs last month" }} />
        <StatsCard title="Growth Rate" value="8.5%" icon={TrendingUp} variant="success" />
        <StatsCard title={isGym || isSuperAdmin ? "Total Users" : "Total Tenants"} value={isSuperAdmin ? 1200 : isGym ? gymStats.totalMembers : pgStats.totalTenants} icon={Users} variant="accent" />
        <StatsCard title="Avg. Retention" value="87%" icon={BarChart3} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border bg-card p-5 shadow-card">
          <h3 className="text-sm font-semibold font-display mb-4">Revenue Trend</h3>
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
          <h3 className="text-sm font-semibold font-display mb-4">{isGym || isSuperAdmin ? "Membership Trends" : "Occupancy Trends"}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={isGym || isSuperAdmin ? gymMembershipData : pgOccupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              {isGym || isSuperAdmin ? (
                <>
                  <Line type="monotone" dataKey="active" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="new" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
                </>
              ) : (
                <>
                  <Line type="monotone" dataKey="occupied" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="vacant" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
