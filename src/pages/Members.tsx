import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { gymMembers, pgTenants } from "@/data/mockData";

export default function Members() {
  const { user } = useAuth();
  const isGym = user?.businessType === "gym";

  const gymCols = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "plan", label: "Plan" },
    { key: "trainer", label: "Trainer" },
    { key: "expiryDate", label: "Expiry" },
    { key: "status", label: "Status", render: (item: any) => <StatusBadge status={item.status} /> },
  ];

  const pgCols = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "room", label: "Room" },
    { key: "rent", label: "Rent", render: (item: any) => `₹${item.rent}` },
    { key: "status", label: "Status", render: (item: any) => <StatusBadge status={item.status} /> },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title={isGym ? "Members" : "Tenants"} description={isGym ? "Manage gym members" : "Manage PG tenants"}>
        <Button className="gradient-primary text-primary-foreground hover:opacity-90">+ Add {isGym ? "Member" : "Tenant"}</Button>
      </PageHeader>
      <DataTable columns={isGym ? gymCols : pgCols} data={isGym ? gymMembers : pgTenants} />
    </div>
  );
}
