"use client";

/**
 * Client-side auth context for Joba's Closet.
 * The session lives in an httpOnly cookie; this provider only mirrors
 * `GET /api/auth/me` into React state and exposes auth actions.
 * Accounts are optional everywhere — guest checkout always works.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
};

type AuthResult = { ok: boolean; error?: string };

type AuthCtx = {
  user: AuthUser | null;
  /** True until the first /api/auth/me round-trip resolves. */
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, phone: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateProfile: (name: string, phone: string) => Promise<AuthResult>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<AuthResult>;
};

const Ctx = createContext<AuthCtx | null>(null);

/** POST/PATCH helper that reads the body once and returns { result, data }. */
async function post(
  url: string,
  body: Record<string, unknown>,
  method: "POST" | "PATCH" = "POST",
): Promise<{ result: AuthResult; data: Record<string, unknown> }> {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    const result: AuthResult =
      res.ok && data.success
        ? { ok: true }
        : { ok: false, error: (data.error as string) ?? "Something went wrong. Please try again." };
    return { result, data };
  } catch {
    return { result: { ok: false, error: "Something went wrong. Please try again." }, data: {} };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d: { user: AuthUser | null }) => {
        if (alive) setUser(d.user ?? null);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const { result, data } = await post("/api/auth/login", { email, password });
    if (result.ok && data.user) setUser(data.user as AuthUser);
    return result;
  }, []);

  const register = useCallback(
    async (name: string, email: string, phone: string, password: string): Promise<AuthResult> => {
      const { result, data } = await post("/api/auth/register", { name, email, phone, password });
      if (result.ok && data.user) setUser(data.user as AuthUser);
      return result;
    },
    [],
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (name: string, phone: string): Promise<AuthResult> => {
    const { result, data } = await post("/api/auth/profile", { name, phone }, "PATCH");
    if (result.ok && data.user) setUser(data.user as AuthUser);
    return result;
  }, []);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<AuthResult> => {
      const { result } = await post("/api/auth/password", { currentPassword, newPassword });
      return result;
    },
    [],
  );

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateProfile, changePassword }),
    [user, loading, login, register, logout, updateProfile, changePassword],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/** "Nusrat Jahan" → "NJ" for the avatar chip. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
