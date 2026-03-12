import { useState, type FormEvent } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useMembers } from "@/contexts/MembersContext";
import { useStaff } from "@/contexts/StaffContext";
import type { GymMember, PgTenant } from "@/lib/members-data";
import type { AddGymMemberInput, AddPgTenantInput } from "@/contexts/MembersContext";
import { Pencil, Plus, Trash2 } from "lucide-react";

const GYM_PLANS = ["Monthly", "Quarterly", "Annual"];
const GYM_STATUSES = ["active", "pending", "overdue", "dropped"] as const;
const PG_STATUSES = ["paid", "pending", "overdue"] as const;

const emptyGymForm: AddGymMemberInput = {
  name: "",
  email: "",
  phone: "",
  plan: "Monthly",
  trainer: "",
  status: "active",
  joinDate: "",
  expiryDate: "",
  totalAmount: 0,
  amountDue: 0,
};

const emptyPgForm: AddPgTenantInput = {
  name: "",
  email: "",
  phone: "",
  room: "",
  rent: 0,
  status: "paid",
  joinDate: "",
  dueDate: "",
};

export default function Members() {
  const { user } = useAuth();
  const isGym = user?.businessType === "gym";
  const { gymMembers, pgTenants, addGymMember, updateGymMember, deleteGymMember, addPgTenant, updatePgTenant, deletePgTenant } = useMembers();
  const { trainers } = useStaff();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState<GymMember | PgTenant | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [gymForm, setGymForm] = useState<AddGymMemberInput>(emptyGymForm);
  const [pgForm, setPgForm] = useState<AddPgTenantInput>(emptyPgForm);

  const data = isGym ? gymMembers : pgTenants;
  const trainerOptions = trainers.map((t) => t.name);

  const openAdd = () => {
    setEditingId(null);
    setGymForm(emptyGymForm);
    setPgForm(emptyPgForm);
    if (isGym && trainerOptions[0]) setGymForm((f) => ({ ...f, trainer: trainerOptions[0] }));
    setDialogOpen(true);
  };

  const openEdit = (item: GymMember | PgTenant) => {
    setEditingId(item.id);
    if (isGym) {
      const m = item as GymMember;
      setGymForm({
        name: m.name,
        email: m.email,
        phone: m.phone,
        plan: m.plan,
        trainer: m.trainer,
        status: m.status,
        joinDate: m.joinDate,
        expiryDate: m.expiryDate,
        totalAmount: m.totalAmount ?? 0,
        amountDue: m.amountDue,
      });
    } else {
      const t = item as PgTenant;
      setPgForm({
        name: t.name,
        email: t.email,
        phone: t.phone,
        room: t.room,
        rent: t.rent,
        status: t.status,
        joinDate: t.joinDate,
        dueDate: t.dueDate,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isGym) {
      const result = editingId ? updateGymMember(editingId, gymForm) : addGymMember(gymForm);
      if (result.ok) {
        toast({ title: editingId ? "Member updated" : "Member added", description: result.member?.name });
        setDialogOpen(false);
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } else {
      const result = editingId ? updatePgTenant(editingId, pgForm) : addPgTenant(pgForm);
      if (result.ok) {
        toast({ title: editingId ? "Tenant updated" : "Tenant added", description: result.tenant?.name });
        setDialogOpen(false);
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    }
  };

  const handleDelete = () => {
    if (!toDelete) return;
    if (isGym) {
      deleteGymMember(toDelete.id);
      toast({ title: "Member deleted", description: (toDelete as GymMember).name });
    } else {
      deletePgTenant(toDelete.id);
      toast({ title: "Tenant deleted", description: (toDelete as PgTenant).name });
    }
    setToDelete(null);
  };

  const gymCols = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "plan", label: "Plan" },
    { key: "trainer", label: "Trainer" },
    { key: "expiryDate", label: "Expiry" },
    { key: "totalAmount", label: "Total (₹)", render: (item: GymMember) => `₹${(item.totalAmount ?? 0).toLocaleString()}` },
    { key: "amountDue", label: "Pending (₹)", render: (item: GymMember) => `₹${(item.amountDue ?? 0).toLocaleString()}` },
    { key: "status", label: "Status", render: (item: GymMember) => <StatusBadge status={item.status} /> },
    {
      key: "actions",
      label: "Actions",
      render: (item: GymMember) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
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

  const pgCols = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "room", label: "Room" },
    { key: "rent", label: "Rent", render: (item: PgTenant) => `₹${item.rent}` },
    { key: "status", label: "Status", render: (item: PgTenant) => <StatusBadge status={item.status} /> },
    {
      key: "actions",
      label: "Actions",
      render: (item: PgTenant) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
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
        title={isGym ? "Members" : "Tenants"}
        description={isGym ? "Manage gym members" : "Manage PG tenants"}
      >
        <Button className="gradient-primary text-primary-foreground hover:opacity-90" onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add {isGym ? "Member" : "Tenant"}
        </Button>
      </PageHeader>
      <DataTable columns={isGym ? gymCols : pgCols} data={data} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "Add"} {isGym ? "Member" : "Tenant"}</DialogTitle>
            <DialogDescription>Fill in the details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isGym ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="gym-name">Name</Label>
                  <Input
                    id="gym-name"
                    value={gymForm.name}
                    onChange={(e) => setGymForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gym-email">Email</Label>
                  <Input
                    id="gym-email"
                    type="email"
                    value={gymForm.email}
                    onChange={(e) => setGymForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gym-phone">Phone</Label>
                  <Input
                    id="gym-phone"
                    value={gymForm.phone}
                    onChange={(e) => setGymForm((f) => ({ ...f, phone: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Plan</Label>
                  <Select value={gymForm.plan} onValueChange={(v) => setGymForm((f) => ({ ...f, plan: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GYM_PLANS.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Trainer</Label>
                  <Select value={gymForm.trainer} onValueChange={(v) => setGymForm((f) => ({ ...f, trainer: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainerOptions.map((name) => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={gymForm.status} onValueChange={(v) => setGymForm((f) => ({ ...f, status: v as AddGymMemberInput["status"] }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GYM_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gym-join">Join date</Label>
                    <Input
                      id="gym-join"
                      type="date"
                      value={gymForm.joinDate}
                      onChange={(e) => setGymForm((f) => ({ ...f, joinDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gym-expiry">Expiry date</Label>
                    <Input
                      id="gym-expiry"
                      type="date"
                      value={gymForm.expiryDate}
                      onChange={(e) => setGymForm((f) => ({ ...f, expiryDate: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gym-total">Total amount (₹)</Label>
                  <Input
                    id="gym-total"
                    type="number"
                    min={0}
                    value={gymForm.totalAmount || ""}
                    onChange={(e) => setGymForm((f) => ({ ...f, totalAmount: Number(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gym-due">Pending / Amount due (₹)</Label>
                  <Input
                    id="gym-due"
                    type="number"
                    min={0}
                    value={gymForm.amountDue || ""}
                    onChange={(e) => setGymForm((f) => ({ ...f, amountDue: Number(e.target.value) || 0 }))}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="pg-name">Name</Label>
                  <Input
                    id="pg-name"
                    value={pgForm.name}
                    onChange={(e) => setPgForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pg-email">Email</Label>
                  <Input
                    id="pg-email"
                    type="email"
                    value={pgForm.email}
                    onChange={(e) => setPgForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pg-phone">Phone</Label>
                  <Input
                    id="pg-phone"
                    value={pgForm.phone}
                    onChange={(e) => setPgForm((f) => ({ ...f, phone: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pg-room">Room</Label>
                  <Input
                    id="pg-room"
                    value={pgForm.room}
                    onChange={(e) => setPgForm((f) => ({ ...f, room: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pg-rent">Rent (₹)</Label>
                  <Input
                    id="pg-rent"
                    type="number"
                    min={0}
                    value={pgForm.rent || ""}
                    onChange={(e) => setPgForm((f) => ({ ...f, rent: Number(e.target.value) || 0 }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={pgForm.status} onValueChange={(v) => setPgForm((f) => ({ ...f, status: v as AddPgTenantInput["status"] }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PG_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pg-join">Join date</Label>
                    <Input
                      id="pg-join"
                      type="date"
                      value={pgForm.joinDate}
                      onChange={(e) => setPgForm((f) => ({ ...f, joinDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pg-due">Due date</Label>
                    <Input
                      id="pg-due"
                      type="date"
                      value={pgForm.dueDate}
                      onChange={(e) => setPgForm((f) => ({ ...f, dueDate: e.target.value }))}
                      required
                    />
                  </div>
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
            <AlertDialogTitle>Delete {isGym ? "member" : "tenant"}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {toDelete ? (isGym ? (toDelete as GymMember).name : (toDelete as PgTenant).name) : ""}. This action cannot be undone.
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
