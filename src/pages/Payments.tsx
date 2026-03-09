import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { payments } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

export default function Payments() {
  const { user } = useAuth();
  
  const filtered = user?.role === "super_admin" ? payments :
    user?.businessType === "gym" ? payments.filter(p => p.type === "gym") :
    payments.filter(p => p.type === "pg");

  const columns = [
    { key: "user", label: "User" },
    { key: "type", label: "Type", render: (item: any) => item.type === "gym" ? "Membership" : "Rent" },
    { key: "amount", label: "Amount", render: (item: any) => `₹${item.amount.toLocaleString()}` },
    { key: "date", label: "Date" },
    { key: "method", label: "Method" },
    { key: "status", label: "Status", render: (item: any) => <StatusBadge status={item.status} /> },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Payments" description="Track all payment transactions" />
      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
