import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type User = { id: number; name: string; email: string; role: 'user' | 'admin' };

type AuthState = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  update: (user: User, token?: string) => void;
  logout: () => void;
};

const AuthCtx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t && u) {
      setToken(t);
      try { setUser(JSON.parse(u)); } catch {}
    }
  }, []);

  const authFetch = async (path: string, body: any) => {
    const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    let data: any = null;
    try { data = await res.json(); } catch { /* no body */ }
    if (!res.ok) {
      const msg = (data && (data.error || data.message)) || res.statusText || 'Request failed';
      const err: any = new Error(msg);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  };

  const login = async (email: string, password: string) => {
    const data = await authFetch('/api/auth/login', { email, password });
    setUser(data.user); setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
  };
  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    const data = await authFetch('/api/auth/register', { firstName, lastName, email, password });
    setUser(data.user); setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
  };
  const update = (u: User, t?: string) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
    if (t) { setToken(t); localStorage.setItem('token', t); }
  };
  const logout = () => { setUser(null); setToken(null); localStorage.removeItem('user'); localStorage.removeItem('token'); };

  const value = useMemo(() => ({ user, token, login, register, update, logout }), [user, token]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
