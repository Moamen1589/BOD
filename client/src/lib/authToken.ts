const AUTH_TOKEN_STORAGE_KEY = "bodAuthTokenEnc";
const AUTH_TOKEN_STORAGE_PREFIX = "enc:v1:";
const AUTH_TOKEN_SECRET = "BOD_AUTH_SECRET_V1";

const toBase64 = (value: string): string => {
  return btoa(value);
};

const fromBase64 = (value: string): string | null => {
  try {
    return atob(value);
  } catch {
    return null;
  }
};

const xorTransform = (input: string): string => {
  let result = "";

  for (let index = 0; index < input.length; index += 1) {
    const inputCode = input.charCodeAt(index);
    const secretCode = AUTH_TOKEN_SECRET.charCodeAt(
      index % AUTH_TOKEN_SECRET.length,
    );
    result += String.fromCharCode(inputCode ^ secretCode);
  }

  return result;
};

export const encodeAuthToken = (token: string): string => {
  return `${AUTH_TOKEN_STORAGE_PREFIX}${toBase64(xorTransform(token))}`;
};

export const decodeAuthToken = (storedValue: string): string | null => {
  if (!storedValue?.startsWith(AUTH_TOKEN_STORAGE_PREFIX)) {
    return storedValue?.trim() || null;
  }

  const encodedPayload = storedValue.slice(AUTH_TOKEN_STORAGE_PREFIX.length);
  const decodedPayload = fromBase64(encodedPayload);
  if (!decodedPayload) {
    return null;
  }

  return xorTransform(decodedPayload).trim() || null;
};

export const normalizeStoredAuthTokenValue = (
  value: unknown,
): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  return decodeAuthToken(value.trim());
};

export const saveEncryptedAuthToken = (token: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, encodeAuthToken(token));
};

export const getStoredEncryptedAuthToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  return decodeAuthToken(stored);
};

const TOKEN_FIELDS = [
  "token",
  "access_token",
  "accessToken",
  "auth_token",
  "authToken",
  "jwt",
  "bearerToken",
  "id_token",
  "idToken",
];

export const extractTokenFromPayload = (payload: unknown): string | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;

  for (const field of TOKEN_FIELDS) {
    const value = normalizeStoredAuthTokenValue(record[field]);
    if (value) {
      return value;
    }
  }

  const nested = ["data", "auth", "user", "session", "tokens"];
  for (const key of nested) {
    const nestedToken = extractTokenFromPayload(record[key]);
    if (nestedToken) {
      return nestedToken;
    }
  }

  return null;
};

export { AUTH_TOKEN_STORAGE_KEY };
