export const REGISTRATION_STORAGE_KEY = "organizationRegistration";
export const ORG_ID_STORAGE_KEY = "orgId";

export type OrganizationRegistration = {
  id: string;
  name: string;
  email: string;
  type: string;
  liscense_number: string;
  phone_number: string;
  evaluation_duration: number;
  evaluator_name: string;
  evaluation_team: string;
  representative_name: string;
  evaluation_date: string;
  registered_at: string;
};

export const hasCompletedRegistration = (): boolean => {
  try {
    const sessionRaw = sessionStorage.getItem(REGISTRATION_STORAGE_KEY);
    if (sessionRaw) {
      return true;
    }

    const raw = localStorage.getItem(REGISTRATION_STORAGE_KEY);
    if (raw) {
      return true;
    }

    // Backward compatibility with previous flow that stored only orgId.
    return Boolean(
      localStorage.getItem(ORG_ID_STORAGE_KEY) ||
      sessionStorage.getItem(ORG_ID_STORAGE_KEY),
    );
  } catch {
    return false;
  }
};

export const saveRegistration = (registration: OrganizationRegistration) => {
  localStorage.setItem(REGISTRATION_STORAGE_KEY, JSON.stringify(registration));
  localStorage.setItem(ORG_ID_STORAGE_KEY, registration.id);
};

export const getStoredOrgId = (): string | null => {
  return localStorage.getItem(ORG_ID_STORAGE_KEY);
};

export const getStoredRegistration =
  (): Partial<OrganizationRegistration> | null => {
    try {
      const rawSession =
        typeof window !== "undefined"
          ? sessionStorage.getItem(REGISTRATION_STORAGE_KEY)
          : null;
      const rawLocal =
        typeof window !== "undefined"
          ? localStorage.getItem(REGISTRATION_STORAGE_KEY)
          : null;
      const raw = rawSession || rawLocal;
      if (!raw) return null;
      return JSON.parse(raw) as Partial<OrganizationRegistration>;
    } catch {
      return null;
    }
  };

export const saveRegistrationToSession = (
  registration: Partial<OrganizationRegistration>,
) => {
  try {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(
      REGISTRATION_STORAGE_KEY,
      JSON.stringify(registration),
    );
  } catch {
    // ignore
  }
};
