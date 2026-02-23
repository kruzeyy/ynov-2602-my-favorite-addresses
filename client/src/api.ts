import type { Address } from "./types";

const API_BASE = "/api";

function getToken(): string | null {
  return localStorage.getItem("token");
}

export async function register(email: string, password: string) {
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Erreur inscription");
  return data;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/users/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Erreur connexion");
  if (data.token) localStorage.setItem("token", data.token);
  return data;
}

export function logout() {
  localStorage.removeItem("token");
}

export async function getMe() {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.item ?? null;
}

export async function getAddresses(): Promise<Address[]> {
  const token = getToken();
  if (!token) return [];
  const res = await fetch(`${API_BASE}/addresses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items ?? [];
}

export async function addAddress(
  searchWord: string,
  name: string,
  description?: string
): Promise<Address> {
  const token = getToken();
  if (!token) throw new Error("Non connecté");
  const res = await fetch(`${API_BASE}/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ searchWord, name, description: description || undefined }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Impossible d'ajouter l'adresse");
  return data.item;
}
