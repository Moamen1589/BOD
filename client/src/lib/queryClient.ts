import { QueryClient, QueryFunction } from "@tanstack/react-query";
import {
  AUTH_TOKEN_STORAGE_KEY,
  getStoredEncryptedAuthToken,
  normalizeStoredAuthTokenValue,
} from "@/lib/authToken";

const AUTH_TOKEN_KEYS = [
  "token",
  "accessToken",
  "access_token",
  "authToken",
  "auth_token",
  "idToken",
  "id_token",
  "userToken",
  "user_token",
  "apiToken",
  "api_token",
  "jwt",
  "bearerToken",
];

const TOKEN_FIELD_CANDIDATES = [
  "token",
  "accessToken",
  "access_token",
  "authToken",
  "auth_token",
  "idToken",
  "id_token",
  "jwt",
  "bearerToken",
  "bearer_token",
];

const AUTH_KEY_HINTS = ["token", "auth", "jwt", "bearer", "session"];

const isLatin1 = (value: string): boolean => {
  for (let index = 0; index < value.length; index += 1) {
    if (value.charCodeAt(index) > 255) {
      return false;
    }
  }

  return true;
};

const hasControlChars = (value: string): boolean => {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if ((code >= 0 && code <= 31) || code === 127) {
      return true;
    }
  }

  return false;
};

const isLikelyAuthToken = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  if (!isLatin1(trimmed)) {
    return false;
  }

  if (hasControlChars(trimmed)) {
    return false;
  }

  return true;
};

const normalizeTokenValue = (value: unknown): string | null => {
  const trimmed = normalizeStoredAuthTokenValue(value);
  if (!trimmed) {
    return null;
  }

  return isLikelyAuthToken(trimmed) ? trimmed : null;
};

const extractTokenFromObject = (value: unknown): string | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;

  for (const field of TOKEN_FIELD_CANDIDATES) {
    const candidate = normalizeTokenValue(record[field]);
    if (candidate) {
      return candidate;
    }
  }

  // Common wrapped payloads from auth providers.
  const nestedContainers = ["data", "user", "auth", "session", "tokens"];
  for (const nestedKey of nestedContainers) {
    const nestedToken = extractTokenFromObject(record[nestedKey]);
    if (nestedToken) {
      return nestedToken;
    }
  }

  return null;
};

const extractTokenFromStorageValue = (
  rawValue: string | null,
): string | null => {
  const plainToken = normalizeTokenValue(rawValue);
  if (!plainToken) {
    return null;
  }

  if (plainToken.startsWith("{") || plainToken.startsWith("[")) {
    try {
      const parsed = JSON.parse(plainToken);
      const parsedToken = extractTokenFromObject(parsed);
      if (parsedToken) {
        return parsedToken;
      }
    } catch {
      // Fall back to plain token handling.
    }
  }

  return plainToken;
};

export const getStoredAuthToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const encryptedToken = getStoredEncryptedAuthToken();
    if (encryptedToken) {
      return encryptedToken;
    }

    for (const key of AUTH_TOKEN_KEYS) {
      const token = extractTokenFromStorageValue(localStorage.getItem(key));
      if (token) {
        return token;
      }
    }

    // Fallback: inspect auth-related keys only to avoid false positives.
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key) {
        continue;
      }

      if (key === AUTH_TOKEN_STORAGE_KEY) {
        continue;
      }

      const loweredKey = key.toLowerCase();
      const isAuthRelatedKey = AUTH_KEY_HINTS.some((hint) =>
        loweredKey.includes(hint),
      );

      if (!isAuthRelatedKey) {
        continue;
      }

      const token = extractTokenFromStorageValue(localStorage.getItem(key));
      if (token) {
        return token;
      }
    }
  } catch {
    return null;
  }

  return null;
};

export const getRequestHeaders = (hasBody = false): HeadersInit => {
  const headers: Record<string, string> = {};

  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }

  const token = getStoredAuthToken();
  if (token) {
    headers.Authorization = /^Bearer\s+/i.test(token)
      ? token
      : `Bearer ${token}`;
  }

  return headers;
};

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: getRequestHeaders(Boolean(data)),
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      headers: getRequestHeaders(),
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
