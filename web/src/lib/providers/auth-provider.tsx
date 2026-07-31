"use client";

import * as React from "react";

export type UserRole = "admin" | "user";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
};

type SafeUser = Omit<AppUser, "password">;

type AuthContextValue = {
  currentUser: SafeUser | null;
  users: SafeUser[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (input: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) => { ok: boolean; error?: string };
  updateUserRole: (userId: string, role: UserRole) => void;
  removeUser: (userId: string) => { ok: boolean; error?: string };
};

const USERS_STORAGE_KEY = "app-users-store-v1";
const SESSION_STORAGE_KEY = "app-session-v1";

const SEED_USERS: AppUser[] = [
  {
    id: "seed-admin",
    name: "Ava Admin",
    email: "admin@example.com",
    password: "admin",
    role: "admin",
  },
  {
    id: "seed-user",
    name: "Uma User",
    email: "user@example.com",
    password: "user",
    role: "user",
  },
];

function toSafeUser(user: AppUser): SafeUser {
  const safe: Partial<AppUser> = { ...user };
  delete safe.password;
  return safe as SafeUser;
}

function readUsers(): AppUser[] {
  if (typeof window === "undefined") return SEED_USERS;
  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) throw new Error("no users stored");
    const parsed = JSON.parse(raw) as AppUser[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("invalid users store");
    }
    return parsed;
  } catch {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(SEED_USERS));
    return SEED_USERS;
  }
}

function writeUsers(users: AppUser[]) {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = React.useState<AppUser[]>(SEED_USERS);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // One-time SSR-safe hydration of the localStorage-backed user store and
    // session on mount; see note in appearance-provider.tsx.
    const loadedUsers = readUsers();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUsers(loadedUsers);
    const storedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (storedSession && loadedUsers.some((u) => u.id === storedSession)) {
      setCurrentUserId(storedSession);
    }
    setIsLoading(false);
  }, []);

  const login = React.useCallback(
    async (email: string, password: string) => {
      const match = users.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password,
      );
      if (!match) return false;
      setCurrentUserId(match.id);
      window.localStorage.setItem(SESSION_STORAGE_KEY, match.id);
      return true;
    },
    [users],
  );

  const logout = React.useCallback(() => {
    setCurrentUserId(null);
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  }, []);

  const addUser = React.useCallback(
    (input: {
      name: string;
      email: string;
      password: string;
      role: UserRole;
    }) => {
      const emailTaken = users.some(
        (u) => u.email.toLowerCase() === input.email.trim().toLowerCase(),
      );
      if (emailTaken) {
        return { ok: false, error: "A user with that email already exists." };
      }
      const newUser: AppUser = {
        id: `user-${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .slice(2, 7)}`,
        name: input.name.trim(),
        email: input.email.trim(),
        password: input.password,
        role: input.role,
      };
      const next = [...users, newUser];
      setUsers(next);
      writeUsers(next);
      return { ok: true };
    },
    [users],
  );

  const updateUserRole = React.useCallback(
    (userId: string, role: UserRole) => {
      const next = users.map((u) => (u.id === userId ? { ...u, role } : u));
      setUsers(next);
      writeUsers(next);
    },
    [users],
  );

  const removeUser = React.useCallback(
    (userId: string) => {
      const target = users.find((u) => u.id === userId);
      if (!target) return { ok: false, error: "User not found." };
      const remainingAdmins = users.filter(
        (u) => u.role === "admin" && u.id !== userId,
      );
      if (target.role === "admin" && remainingAdmins.length === 0) {
        return { ok: false, error: "At least one admin must remain." };
      }
      if (userId === currentUserId) {
        return { ok: false, error: "You can't remove your own account." };
      }
      const next = users.filter((u) => u.id !== userId);
      setUsers(next);
      writeUsers(next);
      return { ok: true };
    },
    [users, currentUserId],
  );

  const currentUser = React.useMemo(() => {
    const match = users.find((u) => u.id === currentUserId);
    return match ? toSafeUser(match) : null;
  }, [users, currentUserId]);

  const safeUsers = React.useMemo(() => users.map(toSafeUser), [users]);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      currentUser,
      users: safeUsers,
      isLoading,
      login,
      logout,
      addUser,
      updateUserRole,
      removeUser,
    }),
    [
      currentUser,
      safeUsers,
      isLoading,
      login,
      logout,
      addUser,
      updateUserRole,
      removeUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
