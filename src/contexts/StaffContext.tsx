import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  createTrainerId,
  createManagerId,
  readStoredStaff,
  writeStoredStaff,
  type Trainer,
  type PgManager,
} from "@/lib/staff-data";

export interface AddTrainerInput {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  assignedMembers: number;
  rating: number;
}

export interface AddPgManagerInput {
  name: string;
  email: string;
  phone: string;
  assignedFloors: number[];
  tenantsManaged: number;
}

interface StaffContextValue {
  trainers: Trainer[];
  pgManagers: PgManager[];
  addTrainer: (input: AddTrainerInput) => { ok: boolean; trainer?: Trainer; error?: string };
  updateTrainer: (id: string, input: AddTrainerInput) => { ok: boolean; trainer?: Trainer; error?: string };
  deleteTrainer: (id: string) => { ok: boolean; error?: string };
  addPgManager: (input: AddPgManagerInput) => { ok: boolean; manager?: PgManager; error?: string };
  updatePgManager: (id: string, input: AddPgManagerInput) => { ok: boolean; manager?: PgManager; error?: string };
  deletePgManager: (id: string) => { ok: boolean; error?: string };
}

const StaffContext = createContext<StaffContextValue | null>(null);

function validateTrainer(input: AddTrainerInput): string | null {
  if (!input.name?.trim()) return "Name is required.";
  if (!input.email?.trim()) return "Email is required.";
  if (!input.phone?.trim()) return "Phone is required.";
  if (!input.specialization?.trim()) return "Specialization is required.";
  if (typeof input.assignedMembers !== "number" || input.assignedMembers < 0) return "Assigned members must be 0 or more.";
  return null;
}

function validatePgManager(input: AddPgManagerInput): string | null {
  if (!input.name?.trim()) return "Name is required.";
  if (!input.email?.trim()) return "Email is required.";
  if (!input.phone?.trim()) return "Phone is required.";
  if (!Array.isArray(input.assignedFloors)) return "Assigned floors must be a list.";
  if (typeof input.tenantsManaged !== "number" || input.tenantsManaged < 0) return "Tenants managed must be 0 or more.";
  return null;
}

export function StaffProvider({ children }: { children: React.ReactNode }) {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [pgManagers, setPgManagers] = useState<PgManager[]>([]);

  useEffect(() => {
    const stored = readStoredStaff();
    setTrainers(stored.trainers);
    setPgManagers(stored.pgManagers);
  }, []);

  const persist = useCallback((tr: Trainer[], pm: PgManager[]) => {
    writeStoredStaff({ trainers: tr, pgManagers: pm });
  }, []);

  const addTrainer = useCallback(
    (input: AddTrainerInput) => {
      const err = validateTrainer(input);
      if (err) return { ok: false, error: err };
      const trainer: Trainer = {
        id: createTrainerId(),
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.phone.trim(),
        specialization: input.specialization.trim(),
        assignedMembers: Number(input.assignedMembers) || 0,
        rating: Math.min(5, Math.max(0, Number(input.rating) || 0)),
      };
      setTrainers((prev) => {
        const next = [...prev, trainer];
        persist(next, pgManagers);
        return next;
      });
      return { ok: true, trainer };
    },
    [pgManagers, persist],
  );

  const updateTrainer = useCallback(
    (id: string, input: AddTrainerInput) => {
      const err = validateTrainer(input);
      if (err) return { ok: false, error: err };
      setTrainers((prev) => {
        const idx = prev.findIndex((t) => t.id === id);
        if (idx === -1) return prev;
        const next = [...prev];
        next[idx] = {
          id,
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          phone: input.phone.trim(),
          specialization: input.specialization.trim(),
          assignedMembers: Number(input.assignedMembers) || 0,
          rating: Math.min(5, Math.max(0, Number(input.rating) || 0)),
        };
        persist(next, pgManagers);
        return next;
      });
      return { ok: true, trainer: { id, ...input } as Trainer };
    },
    [pgManagers, persist],
  );

  const deleteTrainer = useCallback(
    (id: string) => {
      setTrainers((prev) => {
        const next = prev.filter((t) => t.id !== id);
        persist(next, pgManagers);
        return next;
      });
      return { ok: true };
    },
    [pgManagers, persist],
  );

  const addPgManager = useCallback(
    (input: AddPgManagerInput) => {
      const err = validatePgManager(input);
      if (err) return { ok: false, error: err };
      const manager: PgManager = {
        id: createManagerId(),
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.phone.trim(),
        assignedFloors: Array.isArray(input.assignedFloors) ? input.assignedFloors.map(Number).filter((n) => !Number.isNaN(n)) : [],
        tenantsManaged: Number(input.tenantsManaged) || 0,
      };
      setPgManagers((prev) => {
        const next = [...prev, manager];
        persist(trainers, next);
        return next;
      });
      return { ok: true, manager };
    },
    [trainers, persist],
  );

  const updatePgManager = useCallback(
    (id: string, input: AddPgManagerInput) => {
      const err = validatePgManager(input);
      if (err) return { ok: false, error: err };
      const floors = Array.isArray(input.assignedFloors) ? input.assignedFloors.map(Number).filter((n) => !Number.isNaN(n)) : [];
      setPgManagers((prev) => {
        const idx = prev.findIndex((m) => m.id === id);
        if (idx === -1) return prev;
        const next = [...prev];
        next[idx] = {
          id,
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          phone: input.phone.trim(),
          assignedFloors: floors,
          tenantsManaged: Number(input.tenantsManaged) || 0,
        };
        persist(trainers, next);
        return next;
      });
      return { ok: true, manager: { id, assignedFloors: floors, ...input } as PgManager };
    },
    [trainers, persist],
  );

  const deletePgManager = useCallback(
    (id: string) => {
      setPgManagers((prev) => {
        const next = prev.filter((m) => m.id !== id);
        persist(trainers, next);
        return next;
      });
      return { ok: true };
    },
    [trainers, persist],
  );

  const value = useMemo(
    () => ({
      trainers,
      pgManagers,
      addTrainer,
      updateTrainer,
      deleteTrainer,
      addPgManager,
      updatePgManager,
      deletePgManager,
    }),
    [
      trainers,
      pgManagers,
      addTrainer,
      updateTrainer,
      deleteTrainer,
      addPgManager,
      updatePgManager,
      deletePgManager,
    ],
  );

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
}

export function useStaff() {
  const ctx = useContext(StaffContext);
  if (ctx) return ctx;
  const noop = () => ({ ok: false as const, error: "Not available" });
  return {
    trainers: [],
    pgManagers: [],
    addTrainer: noop,
    updateTrainer: noop,
    deleteTrainer: noop,
    addPgManager: noop,
    updatePgManager: noop,
    deletePgManager: noop,
  };
}
