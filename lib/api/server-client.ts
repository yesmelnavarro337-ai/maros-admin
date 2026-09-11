import "server-only";
import { cookies } from "next/headers";
import { API_URL, AUTH_COOKIE_NAME } from "./config";
import { throwIfError } from "./errors";

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
}

export async function serverApiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  const response = await fetch(`${API_URL}/api/${path}`, {
    method: options.method ?? "GET",
    headers: {
      "content-type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  await throwIfError(response);

  if (response.status === 204) return undefined as T;
  return response.json();
}