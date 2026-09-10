import { apiFetch } from "@/lib/api/client-fetcher";

export interface CurrentUser {
  name: string;
  email: string;
  role: string;
}

interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResult {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "No se pudo iniciar sesión. Intenta nuevamente.");
  }

  return response.json();
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function getCurrentUser(): Promise<CurrentUser> {
  return apiFetch<CurrentUser>("Auth/me");
}