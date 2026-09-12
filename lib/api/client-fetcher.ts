import { throwIfError } from "./errors";

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
}

const pendingGetRequests = new Map<string, Promise<unknown>>();

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const method = options.method ?? "GET";
  const requestKey = `${method}:${path}`;

  if (method === "GET") {
    const pending = pendingGetRequests.get(requestKey);
    if (pending) return pending as Promise<T>;
  }

  const request = fetchApi<T>(path, options, method);
  if (method === "GET") pendingGetRequests.set(requestKey, request);

  try {
    return await request;
  } finally {
    if (pendingGetRequests.get(requestKey) === request) pendingGetRequests.delete(requestKey);
  }
}

async function fetchApi<T>(path: string, options: FetchOptions, method: FetchOptions["method"]): Promise<T> {
  const isFormData = options.body instanceof FormData;

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  const response = await fetch(`/api/proxy/${cleanPath}`, {
    method,
    headers: isFormData ? undefined : { "content-type": "application/json" },
    body: isFormData ? (options.body as FormData) : options.body ? JSON.stringify(options.body) : undefined,
    credentials: "include", // envía la cookie httpOnly automáticamente
  });

  await throwIfError(response);

  if (response.status === 204) return undefined as T;
  return response.json();
}
