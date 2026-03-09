import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { gymMembers } from "@/data/mockData";
import { Users, ClipboardList, Calendar } from "lucide-react";

export default function TrainerDashboard() {
  const myMembers = gymMembers.filter(m => m.trainer === "Arjun");
  const columns = [
    { key: "name", label: "Member" },
    { key: "plan", label: "Plan" },
    { key: "expiryDate", label: "Expiry" },
    { key: "status", label: "Status", render: (item: any) => <StatusBadge status={item.status} /> },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Trainer Dashboard" description="Welcome, Arjun — Here are your assigned members" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatsCard title="Assigned Members" value={myMembers.length} icon={Users} variant="primary" />
        <StatsCard title="Active Plans" value={myMembers.filter(m => m.status === "active").length} icon={ClipboardList} variant="success" />
        <StatsCard title="Expiring Soon" value={1} icon={Calendar} variant="warning" />
      </div>
      <h3 className="text-lg font-semibold font-display mb-4">My Members</h3>
      <DataTable columns={columns} data={myMembers} />
    </div>
  );
}
