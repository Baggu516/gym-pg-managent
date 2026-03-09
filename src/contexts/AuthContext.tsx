import React, { createContext, useContext, useState, useCallback } from "react";

import { readStoredClients } from "@/lib/client-data";

export type UserRole = "super_admin" | "owner" | "staff" | "member" | "tenant";
export type BusinessType = "gym" | "pg";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessType?: BusinessType;
  tenantId?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole, businessType?: BusinessType) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, User> = {
  super_admin: { id: "1", name: "Platform Admin", email: "admin@gymflow.io", role: "super_admin" },
  owner_gym: { id: "2", name: "Rajesh Kumar", email: "rajesh@fitzone.com", role: "owner", businessType: "gym", tenantId: "t1" },
  owner_pg: { id: "3", name: "Priya Sharma", email: "priya@comfortpg.com", role: "owner", businessType: "pg", tenantId: "t2" },
  staff_gym: { id: "4", name: "Arjun Trainer", email: "arjun@fitzone.com", role: "staff", businessType: "gym", tenantId: "t1" },
  staff_pg: { id: "5", name: "Neha Manager", email: "neha@comfortpg.com", role: "staff", businessType: "pg", tenantId: "t2" },
  member: { id: "6", name: "Amit Patel", email: "amit@gmail.com", role: "member", businessType: "gym", tenantId: "t1" },
  tenant: { id: "7", name: "Vikram Singh", email: "vikram@gmail.com", role: "tenant", businessType: "pg", tenantId: "t2" },
};

const DEMO_PASSWORD = "demo";

function getStoredOwnerUsers(): Array<User & { password: string }> {
  return readStoredClients().flatMap((client) =>
    client.pocs.map((poc, index) => ({
      id: `${client.id}-owner-${index + 1}`,
      name: poc.name,
      email: poc.email,
      password: poc.password,
      role: "owner" as const,
      businessType: client.type,
      tenantId: client.id,
    })),
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const builtInUser = Object.values(MOCK_USERS).find((candidate) => candidate.email.toLowerCase() === normalizedEmail);

    if (builtInUser) {
      if (password !== DEMO_PASSWORD) {
        return { ok: false, error: `Use "${DEMO_PASSWORD}" as the password for demo accounts.` };
      }

      setUser(builtInUser);
      return { ok: true };
    }

    const storedOwner = getStoredOwnerUsers().find((candidate) => candidate.email === normalizedEmail);
    if (!storedOwner) {
      return { ok: false, error: "No account found with that email address." };
    }

    if (storedOwner.password !== password) {
      return { ok: false, error: "Incorrect password." };
    }

    setUser(storedOwner);
    return { ok: true };
  }, []);

  const register = useCallback(async (_name: string, email: string, _password: string) => {
    setUser({ id: "new", name: _name, email, role: "owner", businessType: "gym", tenantId: "t_new" });
    return { ok: true };
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const switchRole = useCallback((role: UserRole, businessType?: BusinessType) => {
    const key = businessType ? `${role}_${businessType}` : role;
    const mockUser = MOCK_USERS[key] || MOCK_USERS[role];
    if (mockUser) setUser(mockUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
