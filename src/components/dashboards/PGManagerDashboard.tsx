import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { pgTenants } from "@/data/mockData";
import { Users, BedDouble, Clock } from "lucide-react";

export default function PGManagerDashboard() {
  const columns = [
    { key: "name", label: "Tenant" },
    { key: "room", label: "Room" },
    { key: "rent", label: "Rent", render: (item: any) => `₹${item.rent}` },
    { key: "dueDate", label: "Due Date" },
    { key: "status", label: "Status", render: (item: any) => <StatusBadge status={item.status} /> },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Manager Dashboard" description="Welcome, Neha — Manage your assigned tenants" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatsCard title="My Tenants" value={pgTenants.length} icon={Users} variant="primary" />
        <StatsCard title="Rooms Managed" value={6} icon={BedDouble} variant="success" />
        <StatsCard title="Pending Rent" value={2} icon={Clock} variant="warning" />
      </div>
      <h3 className="text-lg font-semibold font-display mb-4">Tenants</h3>
      <DataTable columns={columns} data={pgTenants} />
    </div>
  );
}
