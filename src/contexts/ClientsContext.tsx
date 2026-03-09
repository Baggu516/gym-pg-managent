import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { platformStats } from "@/data/mockData";
import { CLIENTS_STORAGE_KEY, readStoredClients, seedClientIds } from "@/lib/client-data";
import type { AddClientInput, ClientRecord } from "@/lib/client-data";

interface ClientMutationResult {
  ok: boolean;
  client?: ClientRecord;
  error?: string;
}

interface ClientStats {
  totalClients: number;
  activeSubscriptions: number;
  revenue: number;
  gymClients: number;
  pgClients: number;
  trialClients: number;
}

interface ClientsContextValue {
  clients: ClientRecord[];
  stats: ClientStats;
  addClient: (input: AddClientInput) => ClientMutationResult;
  updateClient: (clientId: string, input: AddClientInput) => ClientMutationResult;
  deleteClient: (clientId: string) => { ok: boolean; error?: string };
}

const ClientsContext = createContext<ClientsContextValue | null>(null);

function createClientId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `client-${Date.now()}`;
}

function deriveStats(clients: ClientRecord[]): ClientStats {
  const addedClients = clients.filter((client) => !seedClientIds.has(client.id));
  const addedRevenue = addedClients.reduce((sum, client) => sum + client.revenue, 0);
  const addedGymClients = addedClients.filter((client) => client.type === "gym").length;
  const addedPgClients = addedClients.length - addedGymClients;
  const addedTrialClients = addedClients.filter((client) => client.status === "trial").length;
  const addedActiveSubscriptions = addedClients.filter((client) => client.status !== "trial").length;

  return {
    totalClients: platformStats.totalClients + addedClients.length,
    activeSubscriptions: platformStats.activeSubscriptions + addedActiveSubscriptions,
    revenue: platformStats.revenue + addedRevenue,
    gymClients: platformStats.gymClients + addedGymClients,
    pgClients: platformStats.pgClients + addedPgClients,
    trialClients: platformStats.trialClients + addedTrialClients,
  };
}

function normalizeInput(input: AddClientInput) {
  const name = input.name.trim();
  const plan = input.plan.trim();
  const pocs = input.pocs
    .map((poc) => ({
      name: poc.name.trim(),
      email: poc.email.trim().toLowerCase(),
      password: poc.password,
    }))
    .filter((poc) => poc.name || poc.email || poc.password);

  return { name, plan, pocs };
}

function validateClientInput(
  input: AddClientInput,
  currentClients: ClientRecord[],
  currentClientId?: string,
): ClientMutationResult | null {
  const { name, plan, pocs } = normalizeInput(input);

  if (!name || !plan || pocs.length === 0) {
    return { ok: false, error: "Please fill in all required fields." };
  }

  if (!Number.isFinite(input.members) || input.members < 0) {
    return { ok: false, error: "Users must be a valid non-negative number." };
  }

  if (!Number.isFinite(input.revenue) || input.revenue < 0) {
    return { ok: false, error: "Revenue must be a valid non-negative number." };
  }

  const invalidPoc = pocs.find((poc) => !poc.name || !poc.email || !poc.password);
  if (invalidPoc) {
    return { ok: false, error: "Each POC needs a name, email, and password." };
  }

  const invalidEmail = pocs.find((poc) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(poc.email));
  if (invalidEmail) {
    return { ok: false, error: "Please enter a valid email for every POC." };
  }

  const duplicatePocEmailsInForm = new Set<string>();
  const hasDuplicatePocEmailInForm = pocs.some((poc) => {
    if (duplicatePocEmailsInForm.has(poc.email)) {
      return true;
    }

    duplicatePocEmailsInForm.add(poc.email);
    return false;
  });

  if (hasDuplicatePocEmailInForm) {
    return { ok: false, error: "Each POC must use a unique email address." };
  }

  const alreadyExists = currentClients.some(
    (client) =>
      client.id !== currentClientId &&
      client.name.trim().toLowerCase() === name.toLowerCase(),
  );

  if (alreadyExists) {
    return { ok: false, error: "A client with that business name already exists." };
  }

  const duplicatePocEmail = currentClients.some(
    (client) =>
      client.id !== currentClientId &&
      client.pocs.some((poc) => pocs.some((newPoc) => newPoc.email === poc.email)),
  );

  if (duplicatePocEmail) {
    return { ok: false, error: "One of the POC email addresses is already in use." };
  }

  return null;
}

export function ClientsProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<ClientRecord[]>(() => readStoredClients());

  useEffect(() => {
    window.localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
  }, [clients]);

  const addClient = useCallback((input: AddClientInput): ClientMutationResult => {
    let result: ClientMutationResult = { ok: false, error: "Unable to add client." };

    setClients((currentClients) => {
      const validationError = validateClientInput(input, currentClients);
      if (validationError) {
        result = validationError;
        return currentClients;
      }

      const { name, plan, pocs } = normalizeInput(input);
      const client: ClientRecord = {
        id: createClientId(),
        name,
        owner: pocs[0].name,
        plan,
        type: input.type,
        members: input.members,
        revenue: input.revenue,
        status: input.status,
        joinedAt: new Date().toISOString().slice(0, 10),
        pocs,
      };

      result = { ok: true, client };
      return [client, ...currentClients];
    });

    return result;
  }, []);

  const updateClient = useCallback((clientId: string, input: AddClientInput): ClientMutationResult => {
    let result: ClientMutationResult = { ok: false, error: "Unable to update client." };

    setClients((currentClients) => {
      const existingClient = currentClients.find((client) => client.id === clientId);
      if (!existingClient) {
        result = { ok: false, error: "Client not found." };
        return currentClients;
      }

      const validationError = validateClientInput(input, currentClients, clientId);
      if (validationError) {
        result = validationError;
        return currentClients;
      }

      const { name, plan, pocs } = normalizeInput(input);
      const updatedClient: ClientRecord = {
        ...existingClient,
        name,
        owner: pocs[0].name,
        plan,
        type: input.type,
        members: input.members,
        revenue: input.revenue,
        status: input.status,
        pocs,
      };

      result = { ok: true, client: updatedClient };
      return currentClients.map((client) => (client.id === clientId ? updatedClient : client));
    });

    return result;
  }, []);

  const deleteClient = useCallback((clientId: string) => {
    let didDelete = false;

    setClients((currentClients) => {
      const nextClients = currentClients.filter((client) => client.id !== clientId);
      didDelete = nextClients.length !== currentClients.length;
      return nextClients;
    });

    return didDelete ? { ok: true } : { ok: false, error: "Client not found." };
  }, []);

  const value = useMemo<ClientsContextValue>(() => ({
    clients,
    stats: deriveStats(clients),
    addClient,
    updateClient,
    deleteClient,
  }), [addClient, clients, deleteClient, updateClient]);

  return <ClientsContext.Provider value={value}>{children}</ClientsContext.Provider>;
}

export function useClients() {
  const context = useContext(ClientsContext);

  if (!context) {
    throw new Error("useClients must be used within ClientsProvider");
  }

  return context;
}
