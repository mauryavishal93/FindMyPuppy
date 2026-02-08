/**
 * Admin API client. All requests to /api/admin/* include the stored JWT.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const getToken = () => localStorage.getItem('findMyPuppy_adminToken');

export async function adminFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  return fetch(`${API_BASE}/api/admin${path}`, { ...options, headers });
}

export async function adminJson<T>(path: string, options?: RequestInit): Promise<{ success: boolean; message?: string } & T> {
  const res = await adminFetch(path, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data as { success: boolean; message?: string } & T;
}

export function setAdminToken(token: string) {
  localStorage.setItem('findMyPuppy_adminToken', token);
}

export function clearAdminToken() {
  localStorage.removeItem('findMyPuppy_adminToken');
}

export function hasAdminToken(): boolean {
  return !!getToken();
}
