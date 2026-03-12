import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  createMemberId,
  createTenantId,
  readStoredMembers,
  writeStoredMembers,
  type GymMember,
  type PgTenant,
} from "@/lib/members-data";

export interface AddGymMemberInput {
  name: string;
  email: string;
  phone: string;
  plan: string;
  trainer: string;
  status: GymMember["status"];
  joinDate: string;
  expiryDate: string;
  totalAmount: number;
  amountDue: number;
}

export interface AddPgTenantInput {
  name: string;
  email: string;
  phone: string;
  room: string;
  rent: number;
  status: PgTenant["status"];
  joinDate: string;
  dueDate: string;
}

interface MembersContextValue {
  gymMembers: GymMember[];
  pgTenants: PgTenant[];
  addGymMember: (input: AddGymMemberInput) => { ok: boolean; member?: GymMember; error?: string };
  updateGymMember: (id: string, input: AddGymMemberInput) => { ok: boolean; member?: GymMember; error?: string };
  deleteGymMember: (id: string) => { ok: boolean; error?: string };
  addPgTenant: (input: AddPgTenantInput) => { ok: boolean; tenant?: PgTenant; error?: string };
  updatePgTenant: (id: string, input: AddPgTenantInput) => { ok: boolean; tenant?: PgTenant; error?: string };
  deletePgTenant: (id: string) => { ok: boolean; error?: string };
}

const MembersContext = createContext<MembersContextValue | null>(null);

function validateGymMember(input: AddGymMemberInput): string | null {
  if (!input.name?.trim()) return "Name is required.";
  if (!input.email?.trim()) return "Email is required.";
  if (!input.phone?.trim()) return "Phone is required.";
  if (!input.plan?.trim()) return "Plan is required.";
  if (!input.trainer?.trim()) return "Trainer is required.";
  if (!input.joinDate || !input.expiryDate) return "Join and expiry dates are required.";
  return null;
}

function validatePgTenant(input: AddPgTenantInput): string | null {
  if (!input.name?.trim()) return "Name is required.";
  if (!input.email?.trim()) return "Email is required.";
  if (!input.phone?.trim()) return "Phone is required.";
  if (!input.room?.trim()) return "Room is required.";
  if (typeof input.rent !== "number" || input.rent < 0) return "Valid rent is required.";
  if (!input.joinDate || !input.dueDate) return "Join and due dates are required.";
  return null;
}

export function MembersProvider({ children }: { children: React.ReactNode }) {
  const [gymMembers, setGymMembers] = useState<GymMember[]>([]);
  const [pgTenants, setPgTenants] = useState<PgTenant[]>([]);

  useEffect(() => {
    const stored = readStoredMembers();
    setGymMembers(stored.gymMembers);
    setPgTenants(stored.pgTenants);
  }, []);

  const persist = useCallback((gym: GymMember[], pg: PgTenant[]) => {
    writeStoredMembers({ gymMembers: gym, pgTenants: pg });
  }, []);

  const addGymMember = useCallback(
    (input: AddGymMemberInput) => {
      const err = validateGymMember(input);
      if (err) return { ok: false, error: err };
      const member: GymMember = {
        id: createMemberId(),
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.phone.trim(),
        plan: input.plan.trim(),
        trainer: input.trainer.trim(),
        status: input.status,
        joinDate: input.joinDate,
        expiryDate: input.expiryDate,
        totalAmount: Number(input.totalAmount) || 0,
        amountDue: Number(input.amountDue) || 0,
      };
      setGymMembers((prev) => {
        const next = [...prev, member];
        persist(next, pgTenants);
        return next;
      });
      return { ok: true, member };
    },
    [pgTenants, persist],
  );

  const updateGymMember = useCallback(
    (id: string, input: AddGymMemberInput) => {
      const err = validateGymMember(input);
      if (err) return { ok: false, error: err };
      setGymMembers((prev) => {
        const idx = prev.findIndex((m) => m.id === id);
        if (idx === -1) return prev;
        const next = [...prev];
        next[idx] = {
          id,
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          phone: input.phone.trim(),
          plan: input.plan.trim(),
          trainer: input.trainer.trim(),
          status: input.status,
          joinDate: input.joinDate,
          expiryDate: input.expiryDate,
          totalAmount: Number(input.totalAmount) || 0,
          amountDue: Number(input.amountDue) || 0,
        };
        persist(next, pgTenants);
        return next;
      });
      return { ok: true, member: { id, ...input } as GymMember };
    },
    [pgTenants, persist],
  );

  const deleteGymMember = useCallback(
    (id: string) => {
      setGymMembers((prev) => {
        const next = prev.filter((m) => m.id !== id);
        persist(next, pgTenants);
        return next;
      });
      return { ok: true };
    },
    [pgTenants, persist],
  );

  const addPgTenant = useCallback(
    (input: AddPgTenantInput) => {
      const err = validatePgTenant(input);
      if (err) return { ok: false, error: err };
      const tenant: PgTenant = {
        id: createTenantId(),
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.phone.trim(),
        room: input.room.trim(),
        rent: Number(input.rent) || 0,
        status: input.status,
        joinDate: input.joinDate,
        dueDate: input.dueDate,
      };
      setPgTenants((prev) => {
        const next = [...prev, tenant];
        persist(gymMembers, next);
        return next;
      });
      return { ok: true, tenant };
    },
    [gymMembers, persist],
  );

  const updatePgTenant = useCallback(
    (id: string, input: AddPgTenantInput) => {
      const err = validatePgTenant(input);
      if (err) return { ok: false, error: err };
      setPgTenants((prev) => {
        const idx = prev.findIndex((t) => t.id === id);
        if (idx === -1) return prev;
        const next = [...prev];
        next[idx] = {
          id,
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          phone: input.phone.trim(),
          room: input.room.trim(),
          rent: Number(input.rent) || 0,
          status: input.status,
          joinDate: input.joinDate,
          dueDate: input.dueDate,
        };
        persist(gymMembers, next);
        return next;
      });
      return { ok: true, tenant: { id, ...input } as PgTenant };
    },
    [gymMembers, persist],
  );

  const deletePgTenant = useCallback(
    (id: string) => {
      setPgTenants((prev) => {
        const next = prev.filter((t) => t.id !== id);
        persist(gymMembers, next);
        return next;
      });
      return { ok: true };
    },
    [gymMembers, persist],
  );

  const value = useMemo(
    () => ({
      gymMembers,
      pgTenants,
      addGymMember,
      updateGymMember,
      deleteGymMember,
      addPgTenant,
      updatePgTenant,
      deletePgTenant,
    }),
    [
      gymMembers,
      pgTenants,
      addGymMember,
      updateGymMember,
      deleteGymMember,
      addPgTenant,
      updatePgTenant,
      deletePgTenant,
    ],
  );

  return <MembersContext.Provider value={value}>{children}</MembersContext.Provider>;
}

export function useMembers() {
  const ctx = useContext(MembersContext);
  if (ctx) return ctx;
  // Fallback when used outside provider (e.g. initial mount / strict mode) so UI doesn't crash
  const noop = () => ({ ok: false as const, error: "Not available" });
  return {
    gymMembers: [],
    pgTenants: [],
    addGymMember: noop,
    updateGymMember: noop,
    deleteGymMember: noop,
    addPgTenant: noop,
    updatePgTenant: noop,
    deletePgTenant: noop,
  };
}
