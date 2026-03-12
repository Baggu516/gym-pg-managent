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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { useClients } from "@/contexts/ClientsContext";
import type { AddClientInput, ClientPoc, ClientRecord } from "@/lib/client-data";
import { BedDouble, Dumbbell, Pencil, Plus, Trash2 } from "lucide-react";

const createEmptyPoc = (): ClientPoc => ({
  name: "",
  email: "",
  password: "",
});

const createInitialForm = (): AddClientInput => ({
  name: "",
  type: "gym",
  plan: "Pro",
  members: 0,
  revenue: 0,
  status: "trial",
  pocs: [],
});

const createFormFromClient = (client: ClientRecord): AddClientInput => ({
  name: client.name,
  type: client.type,
  plan: client.plan,
  members: client.members,
  revenue: client.revenue,
  status: client.status,
  pocs: client.pocs.map((poc) => ({ ...poc })),
});

export default function Clients() {
  const { clients, addClient, updateClient, deleteClient } = useClients();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPocDialogOpen, setIsPocDialogOpen] = useState(false);
  const [form, setForm] = useState<AddClientInput>(createInitialForm());
  const [pocDraft, setPocDraft] = useState<ClientPoc>(createEmptyPoc());
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editingPocIndex, setEditingPocIndex] = useState<number | null>(null);
  const [clientToDelete, setClientToDelete] = useState<ClientRecord | null>(null);

  const columns = [
    { key: "name", label: "Business Name" },
    {
      key: "type",
      label: "Type",
      render: (item: ClientRecord) => (
        <span className="flex items-center gap-1.5 text-xs font-medium">
          {item.type === "gym" ? <Dumbbell className="h-3.5 w-3.5 text-primary" /> : <BedDouble className="h-3.5 w-3.5 text-accent" />}
          {item.type === "gym" ? "Gym" : "PG"}
        </span>
      ),
    },
    {
      key: "owner",
      label: "Owners / POCs",
      render: (item: ClientRecord) => {
        const extraCount = Math.max(item.pocs.length - 1, 0);
        return extraCount > 0 ? `${item.owner} +${extraCount} more` : item.owner;
      },
    },
    { key: "plan", label: "Plan" },
    { key: "members", label: "Users" },
    { key: "revenue", label: "Revenue", render: (item: ClientRecord) => `₹${item.revenue.toLocaleString()}` },
    { key: "status", label: "Status", render: (item: ClientRecord) => <StatusBadge status={item.status} /> },
    {
      key: "actions",
      label: "Actions",
      render: (item: ClientRecord) => (
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => handleEditClient(item)}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setClientToDelete(item)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const updateField = <K extends keyof AddClientInput>(key: K, value: AddClientInput[K]) => {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  };

  const resetForm = () => {
    setForm(createInitialForm());
    setPocDraft(createEmptyPoc());
    setIsPocDialogOpen(false);
    setEditingClientId(null);
    setEditingPocIndex(null);
  };

  const removePoc = (index: number) => {
    setForm((currentForm) => ({
      ...currentForm,
      pocs: currentForm.pocs.filter((_, pocIndex) => pocIndex !== index),
    }));
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleAddClient = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditClient = (client: ClientRecord) => {
    setForm(createFormFromClient(client));
    setEditingClientId(client.id);
    setIsDialogOpen(true);
  };

  const updatePocDraft = <K extends keyof ClientPoc>(key: K, value: ClientPoc[K]) => {
    setPocDraft((current) => ({ ...current, [key]: value }));
  };

  const handleSavePoc = () => {
    const nextPoc = {
      name: pocDraft.name.trim(),
      email: pocDraft.email.trim().toLowerCase(),
      password: pocDraft.password,
    };

    if (!nextPoc.name || !nextPoc.email || !nextPoc.password) {
      toast({
        title: "Could not add POC",
        description: "Please fill in name, email, and password.",
        variant: "destructive",
      });
      return;
    }

    setForm((currentForm) => ({
      ...currentForm,
      pocs: editingPocIndex === null
        ? [...currentForm.pocs, nextPoc]
        : currentForm.pocs.map((poc, index) => (index === editingPocIndex ? nextPoc : poc)),
    }));
    setPocDraft(createEmptyPoc());
    setIsPocDialogOpen(false);
    setEditingPocIndex(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = editingClientId ? updateClient(editingClientId, form) : addClient(form);
    if (!result.ok) {
      toast({
        title: editingClientId ? "Could not update client" : "Could not add client",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: editingClientId ? "Client updated" : "Client added",
      description: editingClientId
        ? `${result.client?.name} was updated successfully.`
        : `${result.client?.name} was created with ${form.pocs.length} owner login${form.pocs.length > 1 ? "s" : ""}.`,
    });
    handleDialogChange(false);
  };

  const handleEditPoc = (index: number) => {
    setPocDraft({ ...form.pocs[index] });
    setEditingPocIndex(index);
    setIsPocDialogOpen(true);
  };

  const handleAddPoc = () => {
    setPocDraft(createEmptyPoc());
    setEditingPocIndex(null);
    setIsPocDialogOpen(true);
  };

  const handleDeleteClient = () => {
    if (!clientToDelete) {
      return;
    }

    const result = deleteClient(clientToDelete.id);
    if (!result.ok) {
      toast({
        title: "Could not delete client",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Client deleted",
      description: `${clientToDelete.name} was removed successfully.`,
    });
    setClientToDelete(null);
  };

  return (
    <div className="animate-fade-in min-w-0">
      <PageHeader title="Client Management" description="Manage all registered businesses">
        <Button className="gradient-primary text-primary-foreground hover:opacity-90" onClick={handleAddClient}>+ Add Client</Button>
      </PageHeader>

      <DataTable columns={columns} data={clients} />

      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClientId ? "Edit Client" : "Add Client"}</DialogTitle>
            <DialogDescription>
              {editingClientId ? "Update this business account and its owner logins." : "Create a new business account for the platform."}
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="client-name">Business Name</Label>
              <Input
                id="client-name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="FitZone Elite"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="client-type">Business Type</Label>
                <Select value={form.type} onValueChange={(value: ClientRecord["type"]) => updateField("type", value)}>
                  <SelectTrigger id="client-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gym">Gym</SelectItem>
                    <SelectItem value="pg">PG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="client-plan">Plan</Label>
                <Select value={form.plan} onValueChange={(value) => updateField("plan", value)}>
                  <SelectTrigger id="client-plan">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Pro">Pro</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Label>POC Table</Label>
                  <p className="text-xs text-muted-foreground mt-1">Click add to open a popup and enter owner details.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleAddPoc}>
                  <Plus className="h-4 w-4" />
                  Add POC
                </Button>
              </div>

              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead>POC Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Password</TableHead>
                      <TableHead className="w-[80px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {form.pocs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No POCs added yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      form.pocs.map((poc, index) => (
                        <TableRow key={`${poc.email}-${index}`}>
                          <TableCell>{poc.name}</TableCell>
                          <TableCell>{poc.email}</TableCell>
                          <TableCell>{poc.password}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button type="button" variant="ghost" size="sm" onClick={() => handleEditPoc(index)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button type="button" variant="ghost" size="sm" onClick={() => removePoc(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="client-users">Users</Label>
                <Input
                  id="client-users"
                  type="number"
                  min="0"
                  value={form.members}
                  onChange={(event) => updateField("members", Number(event.target.value))}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="client-revenue">Monthly Revenue</Label>
                <Input
                  id="client-revenue"
                  type="number"
                  min="0"
                  value={form.revenue}
                  onChange={(event) => updateField("revenue", Number(event.target.value))}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="client-status">Status</Label>
              <Select value={form.status} onValueChange={(value: ClientRecord["status"]) => updateField("status", value)}>
                <SelectTrigger id="client-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expiring">Expiring</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>Cancel</Button>
              <Button type="submit" className="gradient-primary text-primary-foreground hover:opacity-90">
                {editingClientId ? "Update Client" : "Save Client"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPocDialogOpen} onOpenChange={setIsPocDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPocIndex === null ? "Add POC" : "Edit POC"}</DialogTitle>
            <DialogDescription>Enter the owner details for this client.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="poc-name">Full Name</Label>
              <Input
                id="poc-name"
                value={pocDraft.name}
                onChange={(event) => updatePocDraft("name", event.target.value)}
                placeholder="Rajesh Kumar"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="poc-email">Email</Label>
              <Input
                id="poc-email"
                type="email"
                value={pocDraft.email}
                onChange={(event) => updatePocDraft("email", event.target.value)}
                placeholder="owner@business.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="poc-password">Password</Label>
              <Input
                id="poc-password"
                type="password"
                value={pocDraft.password}
                onChange={(event) => updatePocDraft("password", event.target.value)}
                placeholder="Create a password"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsPocDialogOpen(false);
                setPocDraft(createEmptyPoc());
                setEditingPocIndex(null);
              }}
            >
              Cancel
            </Button>
            <Button type="button" className="gradient-primary text-primary-foreground hover:opacity-90" onClick={handleSavePoc}>
              {editingPocIndex === null ? "Add POC" : "Update POC"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={clientToDelete !== null} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client?</AlertDialogTitle>
            <AlertDialogDescription>
              {clientToDelete
                ? `This will permanently remove ${clientToDelete.name} and its owner login records from this demo app.`
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDeleteClient}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
