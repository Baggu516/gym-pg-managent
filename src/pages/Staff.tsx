import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { trainers, pgManagers } from "@/data/mockData";

export default function Staff() {
  const { user } = useAuth();
  const isGym = user?.businessType === "gym";

  const trainerCols = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "specialization", label: "Specialization" },
    { key: "assignedMembers", label: "Members" },
    { key: "rating", label: "Rating", render: (item: any) => `⭐ ${item.rating}` },
  ];

  const managerCols = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "assignedFloors", label: "Floors", render: (item: any) => item.assignedFloors.join(", ") },
    { key: "tenantsManaged", label: "Tenants" },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title={isGym ? "Trainers" : "Managers"} description={isGym ? "Manage gym trainers" : "Manage PG managers"}>
        <Button className="gradient-primary text-primary-foreground hover:opacity-90">+ Add {isGym ? "Trainer" : "Manager"}</Button>
      </PageHeader>
      <DataTable columns={isGym ? trainerCols : managerCols} data={isGym ? trainers : pgManagers} />
    </div>
  );
}
