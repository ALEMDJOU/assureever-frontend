/**
 * Client HTTP centralisé pour communiquer avec l'API FastAPI.
 * Injecte automatiquement le JWT NextAuth dans chaque requête.
 * Gère les erreurs de manière uniforme.
 */

import { ApiError } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const API_PREFIX = "/api/v1";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function apiUrl(path: string): string {
  return `${BASE_URL}${API_PREFIX}${path}`;
}

async function parseError(res: Response): Promise<ApiError> {
  try {
    return await res.json();
  } catch {
    return { detail: `Erreur ${res.status} : ${res.statusText}` };
  }
}

export class ApiException extends Error {
  constructor(
    public status: number,
    public detail: string,
    public errors?: ApiError["erreurs"]
  ) {
    super(detail);
    this.name = "ApiException";
  }
}

// ─── Requête de base ─────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(apiUrl(path), { ...fetchOptions, headers });

  if (!res.ok) {
    const err = await parseError(res);
    throw new ApiException(res.status, err.detail, err.erreurs);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json();
}

// ─── Méthodes publiques ───────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string, token?: string) =>
    request<T>(path, { method: "GET", token }),

  post: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      token,
    }),

  put: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
      token,
    }),

  patch: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
      token,
    }),

  delete: <T>(path: string, token?: string) =>
    request<T>(path, { method: "DELETE", token }),

  /**
   * Télécharge un fichier binaire (ex: facture PDF)
   * et déclenche le téléchargement dans le navigateur.
   */
  downloadFile: async (path: string, filename: string, token?: string) => {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(apiUrl(path), { headers });
    if (!res.ok) {
      const err = await parseError(res);
      throw new ApiException(res.status, err.detail);
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
