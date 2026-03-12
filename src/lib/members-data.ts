import { gymMembers, pgTenants } from "@/data/mockData";

export const MEMBERS_STORAGE_KEY = "product.members";

export type GymMemberStatus = "active" | "pending" | "overdue" | "dropped";
export type PgTenantStatus = "paid" | "pending" | "overdue";

export interface GymMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  trainer: string;
  status: GymMemberStatus;
  joinDate: string;
  expiryDate: string;
  totalAmount: number;
  amountDue: number;
}

export interface PgTenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  room: string;
  rent: number;
  status: PgTenantStatus;
  joinDate: string;
  dueDate: string;
}

export type MemberItem = GymMember | PgTenant;

function normalizeGymMember(raw: unknown): GymMember | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (
    typeof o.id !== "string" ||
    typeof o.name !== "string" ||
    typeof o.email !== "string" ||
    typeof o.phone !== "string" ||
    typeof o.plan !== "string" ||
    typeof o.trainer !== "string" ||
    typeof o.joinDate !== "string" ||
    typeof o.expiryDate !== "string"
  )
    return null;
  const status = o.status as string;
  if (!["active", "pending", "overdue", "dropped"].includes(status)) return null;
  return {
    id: o.id,
    name: String(o.name).trim(),
    email: String(o.email).trim().toLowerCase(),
    phone: String(o.phone).trim(),
    plan: String(o.plan).trim(),
    trainer: String(o.trainer).trim(),
    status: status as GymMemberStatus,
    joinDate: o.joinDate,
    expiryDate: o.expiryDate,
    totalAmount: typeof o.totalAmount === "number" ? o.totalAmount : 0,
    amountDue: typeof o.amountDue === "number" ? o.amountDue : 0,
  };
}

function normalizePgTenant(raw: unknown): PgTenant | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (
    typeof o.id !== "string" ||
    typeof o.name !== "string" ||
    typeof o.email !== "string" ||
    typeof o.phone !== "string" ||
    typeof o.room !== "string" ||
    typeof o.rent !== "number" ||
    typeof o.joinDate !== "string" ||
    typeof o.dueDate !== "string"
  )
    return null;
  const status = o.status as string;
  if (!["paid", "pending", "overdue"].includes(status)) return null;
  return {
    id: o.id,
    name: String(o.name).trim(),
    email: String(o.email).trim().toLowerCase(),
    phone: String(o.phone).trim(),
    room: String(o.room).trim(),
    rent: Number(o.rent),
    status: status as PgTenantStatus,
    joinDate: o.joinDate,
    dueDate: o.dueDate,
  };
}

export interface StoredMembers {
  gymMembers: GymMember[];
  pgTenants: PgTenant[];
}

export function readStoredMembers(): StoredMembers {
  if (typeof window === "undefined") {
    return { gymMembers: [...gymMembers], pgTenants: [...pgTenants] };
  }
  try {
    const raw = window.localStorage.getItem(MEMBERS_STORAGE_KEY);
    if (!raw) return { gymMembers: [...gymMembers], pgTenants: [...pgTenants] };
    const parsed = JSON.parse(raw) as { gymMembers?: unknown[]; pgTenants?: unknown[] };
    const gymMembersList = (parsed.gymMembers ?? []).map(normalizeGymMember).filter((m): m is GymMember => m !== null);
    const pgTenantsList = (parsed.pgTenants ?? []).map(normalizePgTenant).filter((t): t is PgTenant => t !== null);
    return {
      gymMembers: gymMembersList.length ? gymMembersList : [...gymMembers],
      pgTenants: pgTenantsList.length ? pgTenantsList : [...pgTenants],
    };
  } catch {
    return { gymMembers: [...gymMembers], pgTenants: [...pgTenants] };
  }
}

export function writeStoredMembers(data: StoredMembers): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(data));
}

export function createMemberId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `m-${Date.now()}`;
}

export function createTenantId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `pt-${Date.now()}`;
}
