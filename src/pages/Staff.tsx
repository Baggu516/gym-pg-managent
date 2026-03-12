import { useState, type FormEvent } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useStaff } from "@/contexts/StaffContext";
import type { Trainer, PgManager } from "@/lib/staff-data";
import type { AddTrainerInput, AddPgManagerInput } from "@/contexts/StaffContext";
import { Pencil, Plus, Trash2 } from "lucide-react";

const emptyTrainerForm: AddTrainerInput = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  assignedMembers: 0,
  rating: 0,
};

const emptyManagerForm: AddPgManagerInput = {
  name: "",
  email: "",
  phone: "",
  assignedFloors: [],
  tenantsManaged: 0,
};

function parseFloorsInput(value: string): number[] {
  return value
    .split(/[\s,]+/)
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !Number.isNaN(n));
}

export default function Staff() {
  const { user } = useAuth();
  const isGym = user?.businessType === "gym";
  const {
    trainers,
    pgManagers,
    addTrainer,
    updateTrainer,
    deleteTrainer,
    addPgManager,
    updatePgManager,
    deletePgManager,
  } = useStaff();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Trainer | PgManager | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [trainerForm, setTrainerForm] = useState<AddTrainerInput>(emptyTrainerForm);
  const [managerForm, setManagerForm] = useState<AddPgManagerInput>(emptyManagerForm);
  const [floorsInput, setFloorsInput] = useState("");

  const data = isGym ? trainers : pgManagers;

  const openAdd = () => {
    setEditingId(null);
    setTrainerForm(emptyTrainerForm);
    setManagerForm(emptyManagerForm);
    setFloorsInput("");
    setDialogOpen(true);
  };

  const openEdit = (item: Trainer | PgManager) => {
    setEditingId(item.id);
    if (isGym) {
      const t = item as Trainer;
      setTrainerForm({
        name: t.name,
        email: t.email,
        phone: t.phone,
        specialization: t.specialization,
        assignedMembers: t.assignedMembers,
        rating: t.rating,
      });
    } else {
      const m = item as PgManager;
      setManagerForm({
        name: m.name,
        email: m.email,
        phone: m.phone,
        assignedFloors: m.assignedFloors,
        tenantsManaged: m.tenantsManaged,
      });
      setFloorsInput(m.assignedFloors.join(", "));
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isGym) {
      const result = editingId ? updateTrainer(editingId, trainerForm) : addTrainer(trainerForm);
      if (result.ok) {
        toast({ title: editingId ? "Trainer updated" : "Trainer added", description: result.trainer?.name });
        setDialogOpen(false);
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } else {
      const floors = parseFloorsInput(floorsInput);
      const payload = { ...managerForm, assignedFloors: floors };
      const result = editingId ? updatePgManager(editingId, payload) : addPgManager(payload);
      if (result.ok) {
        toast({ title: editingId ? "Manager updated" : "Manager added", description: result.manager?.name });
        setDialogOpen(false);
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    }
  };

  const handleDelete = () => {
    if (!toDelete) return;
    if (isGym) {
      deleteTrainer(toDelete.id);
      toast({ title: "Trainer deleted", description: (toDelete as Trainer).name });
    } else {
      deletePgManager(toDelete.id);
      toast({ title: "Manager deleted", description: (toDelete as PgManager).name });
    }
    setToDelete(null);
  };

  const trainerCols = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "specialization", label: "Specialization" },
    { key: "assignedMembers", label: "Members" },
    { key: "rating", label: "Rating", render: (item: Trainer) => `⭐ ${item.rating}` },
    {
      key: "actions",
      label: "Actions",
      render: (item: Trainer) => (
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => openEdit(item)}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setToDelete(item)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const managerCols = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "assignedFloors",
      label: "Floors",
      render: (item: PgManager) => item.assignedFloors.join(", ") || "—",
    },
    { key: "tenantsManaged", label: "Tenants" },
    {
      key: "actions",
      label: "Actions",
      render: (item: PgManager) => (
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => openEdit(item)}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setToDelete(item)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in min-w-0">
      <PageHeader
        title={isGym ? "Trainers" : "Managers"}
        description={isGym ? "Manage gym trainers" : "Manage PG managers"}
      >
        <Button className="gradient-primary text-primary-foreground hover:opacity-90" onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add {isGym ? "Trainer" : "Manager"}
        </Button>
      </PageHeader>
      <DataTable columns={isGym ? trainerCols : managerCols} data={data} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "Add"} {isGym ? "Trainer" : "Manager"}</DialogTitle>
            <DialogDescription>Fill in the details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isGym ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="tr-name">Name</Label>
                  <Input
                    id="tr-name"
                    value={trainerForm.name}
                    onChange={(e) => setTrainerForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tr-email">Email</Label>
                  <Input
                    id="tr-email"
                    type="email"
                    value={trainerForm.email}
                    onChange={(e) => setTrainerForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tr-phone">Phone</Label>
                  <Input
                    id="tr-phone"
                    value={trainerForm.phone}
                    onChange={(e) => setTrainerForm((f) => ({ ...f, phone: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tr-spec">Specialization</Label>
                  <Input
                    id="tr-spec"
                    value={trainerForm.specialization}
                    onChange={(e) => setTrainerForm((f) => ({ ...f, specialization: e.target.value }))}
                    placeholder="e.g. Strength Training, Yoga"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tr-members">Assigned members</Label>
                  <Input
                    id="tr-members"
                    type="number"
                    min={0}
                    value={trainerForm.assignedMembers || ""}
                    onChange={(e) => setTrainerForm((f) => ({ ...f, assignedMembers: Number(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tr-rating">Rating (0–5)</Label>
                  <Input
                    id="tr-rating"
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    value={trainerForm.rating || ""}
                    onChange={(e) => setTrainerForm((f) => ({ ...f, rating: Number(e.target.value) || 0 }))}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="pm-name">Name</Label>
                  <Input
                    id="pm-name"
                    value={managerForm.name}
                    onChange={(e) => setManagerForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pm-email">Email</Label>
                  <Input
                    id="pm-email"
                    type="email"
                    value={managerForm.email}
                    onChange={(e) => setManagerForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pm-phone">Phone</Label>
                  <Input
                    id="pm-phone"
                    value={managerForm.phone}
                    onChange={(e) => setManagerForm((f) => ({ ...f, phone: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pm-floors">Assigned floors (comma-separated)</Label>
                  <Input
                    id="pm-floors"
                    value={floorsInput}
                    onChange={(e) => setFloorsInput(e.target.value)}
                    placeholder="e.g. 1, 2, 3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pm-tenants">Tenants managed</Label>
                  <Input
                    id="pm-tenants"
                    type="number"
                    min={0}
                    value={managerForm.tenantsManaged || ""}
                    onChange={(e) => setManagerForm((f) => ({ ...f, tenantsManaged: Number(e.target.value) || 0 }))}
                  />
                </div>
              </>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingId ? "Update" : "Add"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {isGym ? "trainer" : "manager"}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {toDelete ? (isGym ? (toDelete as Trainer).name : (toDelete as PgManager).name) : ""}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
