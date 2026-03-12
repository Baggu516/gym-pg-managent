import { trainers, pgManagers } from "@/data/mockData";

export const STAFF_STORAGE_KEY = "product.staff";

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  assignedMembers: number;
  rating: number;
}

export interface PgManager {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedFloors: number[];
  tenantsManaged: number;
}

export type StaffItem = Trainer | PgManager;

function normalizeTrainer(raw: unknown): Trainer | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (
    typeof o.id !== "string" ||
    typeof o.name !== "string" ||
    typeof o.email !== "string" ||
    typeof o.phone !== "string" ||
    typeof o.specialization !== "string" ||
    typeof o.assignedMembers !== "number" ||
    typeof o.rating !== "number"
  )
    return null;
  return {
    id: o.id,
    name: String(o.name).trim(),
    email: String(o.email).trim().toLowerCase(),
    phone: String(o.phone).trim(),
    specialization: String(o.specialization).trim(),
    assignedMembers: Number(o.assignedMembers),
    rating: Math.min(5, Math.max(0, Number(o.rating))),
  };
}

function normalizePgManager(raw: unknown): PgManager | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (
    typeof o.id !== "string" ||
    typeof o.name !== "string" ||
    typeof o.email !== "string" ||
    typeof o.phone !== "string" ||
    typeof o.tenantsManaged !== "number"
  )
    return null;
  const floors = Array.isArray(o.assignedFloors)
    ? (o.assignedFloors as unknown[]).map(Number).filter((n) => !Number.isNaN(n))
    : [];
  return {
    id: o.id,
    name: String(o.name).trim(),
    email: String(o.email).trim().toLowerCase(),
    phone: String(o.phone).trim(),
    assignedFloors: floors,
    tenantsManaged: Number(o.tenantsManaged),
  };
}

export interface StoredStaff {
  trainers: Trainer[];
  pgManagers: PgManager[];
}

export function readStoredStaff(): StoredStaff {
  if (typeof window === "undefined") {
    return { trainers: [...trainers], pgManagers: [...pgManagers] };
  }
  try {
    const raw = window.localStorage.getItem(STAFF_STORAGE_KEY);
    if (!raw) return { trainers: [...trainers], pgManagers: [...pgManagers] };
    const parsed = JSON.parse(raw) as { trainers?: unknown[]; pgManagers?: unknown[] };
    const trainersList = (parsed.trainers ?? []).map(normalizeTrainer).filter((t): t is Trainer => t !== null);
    const managersList = (parsed.pgManagers ?? []).map(normalizePgManager).filter((m): m is PgManager => m !== null);
    return {
      trainers: trainersList.length ? trainersList : [...trainers],
      pgManagers: managersList.length ? managersList : [...pgManagers],
    };
  } catch {
    return { trainers: [...trainers], pgManagers: [...pgManagers] };
  }
}

export function writeStoredStaff(data: StoredStaff): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(data));
}

export function createTrainerId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `tr-${Date.now()}`;
}

export function createManagerId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `pm-${Date.now()}`;
}
