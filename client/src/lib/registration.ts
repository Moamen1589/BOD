export const REGISTRATION_STORAGE_KEY = "organizationRegistration";
export const ORG_ID_STORAGE_KEY = "orgId";

export type OrganizationRegistration = {
  id: string;
  name: string;
  email: string;
  type: string;
  liscense_number: string;
  evaluation_duration: number;
  evaluator_name: string;
  evaluation_team: string;
  representative_name: string;
  evaluation_date: string;
  registered_at: string;
};

export const hasCompletedRegistration = (): boolean => {
  try {
    const raw = localStorage.getItem(REGISTRATION_STORAGE_KEY);
    if (raw) {
      return true;
    }

    // Backward compatibility with previous flow that stored only orgId.
    return Boolean(localStorage.getItem(ORG_ID_STORAGE_KEY));
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
