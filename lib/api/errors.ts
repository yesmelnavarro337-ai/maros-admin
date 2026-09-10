export interface ApiErrorBody {
  status: number;
  message: string;
  errors?: Record<string, string[]> | null;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]> | null;

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiError";
    this.status = body.status;
    this.errors = body.errors ?? null;
  }
}

export async function throwIfError(response: Response): Promise<void> {
  if (response.ok) return;

  let body: ApiErrorBody;
  try {
    body = await response.json();
  } catch {
    body = { status: response.status, message: "Ocurrió un error de comunicación con el servidor." };
  }

  throw new ApiError(body);
}