import { getStoredEncryptedAuthToken } from "./authToken";

const globalAny: any = typeof window !== "undefined" ? window : globalThis;

const originalFetch = globalAny.fetch && globalAny.fetch.bind(globalAny);

if (originalFetch) {
  globalAny.fetch = async (input: RequestInfo, init?: RequestInit) => {
    try {
      const token = getStoredEncryptedAuthToken();

      // If input is a Request, clone and merge headers
      if (input instanceof Request) {
        const req = input as Request;
        const newHeaders = new Headers(req.headers || {});
        if (token && !newHeaders.has("Authorization") && token !== "") {
          newHeaders.set("Authorization", `Bearer ${token}`);
        }
        const newReq = new Request(req, { headers: newHeaders });
        return originalFetch(newReq, init);
      }

      const headers = new Headers((init?.headers as HeadersInit) || {});
      if (token && !headers.has("Authorization") && token !== "") {
        headers.set("Authorization", `Bearer ${token}`);
      }

      const newInit: RequestInit = { ...(init || {}), headers };
      return originalFetch(input, newInit);
    } catch (err) {
      return originalFetch(input, init as RequestInit);
    }
  };
}

export {};
