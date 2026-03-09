import { clients as defaultClients } from "@/data/mockData";

export const CLIENTS_STORAGE_KEY = "product.clients";

export type ClientType = "gym" | "pg";
export type ClientStatus = "active" | "expiring" | "trial";

export interface ClientPoc {
  name: string;
  email: string;
  password: string;
}

export interface ClientRecord {
  id: string;
  name: string;
  type: ClientType;
  owner: string;
  plan: string;
  status: ClientStatus;
  members: number;
  revenue: number;
  joinedAt: string;
  pocs: ClientPoc[];
}

export interface AddClientInput {
  name: string;
  type: ClientType;
  plan: string;
  members: number;
  revenue: number;
  status: ClientStatus;
  pocs: ClientPoc[];
}

const seedOwnerEmails: Record<string, string> = {
  t1: "rajesh@fitzone.com",
  t2: "priya@comfortpg.com",
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
}

function fallbackPocEmail(clientName: string, ownerName: string) {
  const ownerSlug = slugify(ownerName).replace(/\./g, "");
  const clientSlug = slugify(clientName).replace(/\./g, "");
  return `${ownerSlug || "owner"}@${clientSlug || "client"}.demo`;
}

function normalizePoc(poc: unknown): ClientPoc | null {
  if (!poc || typeof poc !== "object") {
    return null;
  }

  const candidate = poc as Record<string, unknown>;
  if (
    typeof candidate.name !== "string" ||
    typeof candidate.email !== "string" ||
    typeof candidate.password !== "string"
  ) {
    return null;
  }

  const name = candidate.name.trim();
  const email = candidate.email.trim().toLowerCase();
  const password = candidate.password;

  if (!name || !email || !password) {
    return null;
  }

  return { name, email, password };
}

function normalizeClient(candidate: unknown): ClientRecord | null {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const value = candidate as Record<string, unknown>;
  if (
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    (value.type !== "gym" && value.type !== "pg") ||
    typeof value.plan !== "string" ||
    (value.status !== "active" && value.status !== "expiring" && value.status !== "trial") ||
    typeof value.members !== "number" ||
    typeof value.revenue !== "number" ||
    typeof value.joinedAt !== "string"
  ) {
    return null;
  }

  const owner = typeof value.owner === "string" && value.owner.trim() ? value.owner.trim() : "";
  const rawPocs = Array.isArray(value.pocs) ? value.pocs : [];
  const pocs = rawPocs.map(normalizePoc).filter((poc): poc is ClientPoc => poc !== null);

  if (pocs.length === 0) {
    if (!owner) {
      return null;
    }

    pocs.push({
      name: owner,
      email: fallbackPocEmail(value.name, owner),
      password: "demo",
    });
  }

  return {
    id: value.id,
    name: value.name.trim(),
    type: value.type,
    owner: owner || pocs[0].name,
    plan: value.plan.trim(),
    status: value.status,
    members: value.members,
    revenue: value.revenue,
    joinedAt: value.joinedAt,
    pocs,
  };
}

export const seedClients: ClientRecord[] = defaultClients.map((client) => {
  const email = seedOwnerEmails[client.id] ?? fallbackPocEmail(client.name, client.owner);
  return {
    ...client,
    pocs: [
      {
        name: client.owner,
        email,
        password: "demo",
      },
    ],
  };
});

export const seedClientIds = new Set(seedClients.map((client) => client.id));

export function readStoredClients() {
  if (typeof window === "undefined") {
    return seedClients;
  }

  try {
    const raw = window.localStorage.getItem(CLIENTS_STORAGE_KEY);
    if (!raw) {
      return seedClients;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return seedClients;
    }

    const normalizedClients = parsed.map(normalizeClient).filter((client): client is ClientRecord => client !== null);
    return normalizedClients.length > 0 ? normalizedClients : seedClients;
  } catch {
    return seedClients;
  }
}
