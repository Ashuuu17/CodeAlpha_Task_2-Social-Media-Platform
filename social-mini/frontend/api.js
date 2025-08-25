export const API_BASE = 'http://localhost:4000/api';

const storage = {
  get token() { return localStorage.getItem('token'); },
  set token(v) { localStorage.setItem('token', v); }
};

export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth && storage.token) headers['Authorization'] = `Bearer ${storage.token}`;
  const res = await fetch(`${API_BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error((await res.json()).message || 'Request failed');
  return res.json();
}

export function setToken(t) { storage.token = t; }
export function getToken() { return storage.token; }
