import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { pgRooms } from "@/data/mockData";

export default function Rooms() {
  const columns = [
    { key: "number", label: "Room #" },
    { key: "type", label: "Type" },
    { key: "floor", label: "Floor" },
    { key: "capacity", label: "Capacity" },
    { key: "occupied", label: "Occupants", render: (item: any) => `${item.occupied}/${item.capacity}` },
    { key: "rent", label: "Rent", render: (item: any) => `₹${item.rent.toLocaleString()}` },
    { key: "status", label: "Status", render: (item: any) => <StatusBadge status={item.status} /> },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Room Management" description="Manage PG rooms and allocations">
        <Button className="gradient-primary text-primary-foreground hover:opacity-90">+ Add Room</Button>
      </PageHeader>
      <DataTable columns={columns} data={pgRooms} />
    </div>
  );
}
