/**
 * Admin Panel root. Renders login or layout+outlet based on auth.
 * Uses pathname-based routing (no react-router required for minimal setup).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { adminJson, setAdminToken, clearAdminToken, hasAdminToken } from './api/client';

type AdminUser = { _id: string; email: string; name: string; role: string; permissions: string[] };

export function AdminApp() {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('findMyPuppy_adminToken'));
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<'dashboard' | 'users' | 'gameplay' | 'login'>(() =>
    typeof window !== 'undefined' && window.location.hash ? (window.location.hash.slice(1) as 'dashboard' | 'users' | 'gameplay') || 'dashboard' : 'dashboard'
  );

  const loadMe = useCallback(async () => {
    if (!hasAdminToken()) {
      setAdmin(null);
      setLoading(false);
      return;
    }
    try {
      const data = await adminJson<{ admin: AdminUser }>('/auth/me');
      setAdmin(data.admin);
    } catch {
      clearAdminToken();
      setTokenState(null);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  useEffect(() => {
    const h = () => setPage((window.location.hash?.slice(1) as 'dashboard' | 'users' | 'gameplay') || 'dashboard');
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const data = await adminJson<{ token: string; admin: AdminUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAdminToken(data.token);
    setTokenState(data.token);
    setAdmin(data.admin);
    setPage('dashboard');
    window.location.hash = 'dashboard';
  };

  const handleLogout = () => {
    clearAdminToken();
    setTokenState(null);
    setAdmin(null);
    setPage('login');
    window.location.hash = '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (!admin && page !== 'login') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <AdminLogin onLogin={handleLogin} />
      </div>
    );
  }

  if (page === 'login') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <AdminLogin onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex">
      <aside className="w-56 bg-slate-800 border-r border-slate-700 p-4 flex flex-col">
        <h1 className="font-bold text-lg text-white mb-4">Find My Puppy Admin</h1>
        <nav className="flex flex-col gap-1">
          {['dashboard', 'users', 'gameplay'].map((p) => (
            <a
              key={p}
              href={`#${p}`}
              className={`px-3 py-2 rounded ${page === p ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700'}`}
            >
              {p === 'dashboard' ? 'Dashboard' : p === 'users' ? 'Users' : 'Gameplay'}
            </a>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-slate-700">
          <span className="text-xs text-slate-400">{admin?.email} ({admin?.role})</span>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 block text-sm text-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        {page === 'dashboard' && <AdminDashboard />}
        {page === 'users' && <AdminUsers />}
        {page === 'gameplay' && <AdminGameplay />}
      </main>
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-sm bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-4">Admin Login</h2>
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 rounded bg-slate-700 border border-slate-600 text-white mb-3"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 rounded bg-slate-700 border border-slate-600 text-white mb-4"
        required
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50"
      >
        {submitting ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState<{
    dau?: number;
    mau?: number;
    totalUsers?: number;
    revenueToday?: number;
    revenueMonth?: number;
    revenueTotal?: number;
    hintsSold?: number;
  } | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    adminJson<{ stats: typeof stats }>('/dashboard/stats')
      .then((d) => setStats(d.stats || null))
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <p className="text-red-400">{err}</p>;
  if (!stats) return <p>Loading stats...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="DAU" value={stats.dau ?? 0} />
        <StatCard label="MAU" value={stats.mau ?? 0} />
        <StatCard label="Total users" value={stats.totalUsers ?? 0} />
        <StatCard label="Hints sold" value={stats.hintsSold ?? 0} />
        <StatCard label="Revenue today (₹)" value={stats.revenueToday ?? 0} />
        <StatCard label="Revenue month (₹)" value={stats.revenueMonth ?? 0} />
        <StatCard label="Revenue total (₹)" value={stats.revenueTotal ?? 0} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState<{ username: string; email: string; points?: number; hints?: number }[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (q) params.set('q', q);
    adminJson<{ users: typeof users; total: number }>(`/users?${params}`)
      .then((d) => {
        setUsers(d.users || []);
        setTotal(d.total || 0);
      })
      .catch((e) => setErr(e.message));
  }, [page, q]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Users</h2>
      <input
        type="search"
        placeholder="Search username or email"
        value={q}
        onChange={(e) => { setQ(e.target.value); setPage(1); }}
        className="mb-4 px-3 py-2 rounded bg-slate-800 border border-slate-600 text-white w-64"
      />
      {err && <p className="text-red-400 mb-2">{err}</p>}
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-left">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-4 py-2 text-slate-300">Username</th>
              <th className="px-4 py-2 text-slate-300">Email</th>
              <th className="px-4 py-2 text-slate-300">Points</th>
              <th className="px-4 py-2 text-slate-300">Hints</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.username} className="border-t border-slate-700">
                <td className="px-4 py-2">{u.username}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.points ?? 0}</td>
                <td className="px-4 py-2">{u.hints ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-slate-400 text-sm">Total: {total}</p>
    </div>
  );
}

function AdminGameplay() {
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    adminJson<{ config: Record<string, unknown> }>('/gameplay/config')
      .then((d) => setConfig(d.config || null))
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <p className="text-red-400">{err}</p>;
  if (!config) return <p>Loading config...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Gameplay config</h2>
      <pre className="bg-slate-800 p-4 rounded border border-slate-700 text-sm overflow-auto">
        {JSON.stringify(config, null, 2)}
      </pre>
    </div>
  );
}
