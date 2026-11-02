// Browser-side API client. Calls same-origin /api/v1/* which Next.js rewrites to the backend.
export class ApiClientError extends Error {
  status: number;
  errors?: { field: string; message: string }[];
  constructor(status: number, message: string, errors?: { field: string; message: string }[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

type Options = Omit<RequestInit, "body"> & { body?: unknown };

export async function api<T = unknown>(path: string, { body, headers, ...init }: Options = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api/v1${path}`, {
      credentials: "include",
      ...init,
      headers: { ...(body !== undefined ? { "Content-Type": "application/json" } : {}), ...headers },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiClientError(0, "Network error — please check your connection and try again.");
  }
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.success === false) {
    throw new ApiClientError(res.status, json?.message || `Request failed (${res.status})`, json?.errors);
  }
  return json?.data as T;
}

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber?: string;
  role: "user" | "admin";
  emailVerified: boolean;
  isActive?: boolean;
  lastLoginAt?: string;
  createdAt: string;
  profile?: {
    role?: string;
    hasCoFounder?: boolean;
    coFounderName?: string;
    startupName?: string;
    industry?: string;
    sector?: string;
    businessDescription?: string;
    state?: string;
    city?: string;
    address?: string;
  };
};

export function utmMeta() {
  if (typeof window === "undefined") return undefined;
  const p = new URLSearchParams(window.location.search);
  return {
    page: window.location.pathname,
    referrer: document.referrer?.slice(0, 500) || undefined,
    utmSource: p.get("utm_source") || undefined,
    utmMedium: p.get("utm_medium") || undefined,
    utmCampaign: p.get("utm_campaign") || undefined,
  };
}
