import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { pgStats, pgTenants, pgOccupancyData, pgRooms } from "@/data/mockData";
import { BedDouble, Users, DoorOpen, Clock, DollarSign, UserCog } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";

export default function PGOwnerDashboard() {
  const tenantCols = [
    { key: "name", label: "Tenant" },
    { key: "room", label: "Room" },
    { key: "rent", label: "Rent", render: (item: any) => `₹${item.rent}` },
    { key: "dueDate", label: "Due Date" },
    { key: "status", label: "Status", render: (item: any) => <StatusBadge status={item.status} /> },
  ];

  const roomCols = [
    { key: "number", label: "Room #" },
    { key: "type", label: "Type" },
    { key: "floor", label: "Floor" },
    { key: "occupied", label: "Occupants", render: (item: any) => `${item.occupied}/${item.capacity}` },
    { key: "rent", label: "Rent", render: (item: any) => `₹${item.rent}` },
    { key: "status", label: "Status", render: (item: any) => <StatusBadge status={item.status} /> },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="PG Dashboard" description="Comfort PG — Manage your accommodation">
        <Button className="gradient-primary text-primary-foreground hover:opacity-90">+ Add Tenant</Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatsCard title="Total Rooms" value={pgStats.totalRooms} icon={BedDouble} variant="primary" />
        <StatsCard title="Occupied" value={pgStats.occupiedRooms} icon={Users} variant="success" />
        <StatsCard title="Vacant" value={pgStats.vacantRooms} icon={DoorOpen} variant="warning" />
        <StatsCard title="Pending Rent" value={pgStats.pendingRent} icon={Clock} variant="destructive" />
        <StatsCard title="Tenants" value={pgStats.totalTenants} icon={UserCog} variant="accent" />
        <StatsCard title="Revenue" value={`₹${(pgStats.monthlyRevenue / 1000).toFixed(0)}K`} icon={DollarSign} variant="primary" />
      </div>

      <div className="rounded-lg border border-border bg-card p-5 shadow-card mb-8">
        <h3 className="text-sm font-semibold font-display mb-4 text-foreground">Occupancy Trends</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={pgOccupancyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Legend />
            <Bar dataKey="occupied" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="vacant" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold font-display mb-4">Rooms</h3>
          <DataTable columns={roomCols} data={pgRooms} />
        </div>
        <div>
          <h3 className="text-lg font-semibold font-display mb-4">Tenants</h3>
          <DataTable columns={tenantCols} data={pgTenants} />
        </div>
      </div>
    </div>
  );
}
