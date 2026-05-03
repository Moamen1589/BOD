import { apiRequest, getRequestHeaders } from "@/lib/queryClient";

const COMPLIANCE_API_BASE = "https://gold-weasel-489740.hostingersite.com";
const COMPLIANCE_SUBMISSION_STORAGE_PREFIX = "complianceSubmissionId";

export type ComplianceQuestion = {
  question_id?: string | number;
  questionId?: string | number;
  id?: string | number;
  question_title?: string | null;
  question?: string | null;
  question_text?: string | null;
  text?: string | null;
  label?: string | null;
  title?: string | null;
};

export type ComplianceQuestionSet = {
  axisTitle: string | null;
  questions: ComplianceQuestion[];
};

export type ComplianceInitiationResult = {
  submissionId: string | null;
  axisQuestionSets: Record<number, ComplianceQuestionSet>;
};

type ComplianceAxisBreakdownItem = {
  axis_id?: string | number;
  axisId?: string | number;
  order?: number;
  title?: string | null;
  axis_title?: string | null;
  name?: string | null;
  questions?: ComplianceQuestion[];
};

type ComplianceSubmissionResponse = {
  submission?: {
    submission_id?: string | number;
    submissionId?: string | number;
    id?: string | number;
  };
  assessment?: {
    axis_breakdown?:
      | ComplianceAxisBreakdownItem[]
      | ComplianceAxisBreakdownItem;
  };
  completion?: {
    axes?: ComplianceAxisBreakdownItem[];
  };
  submission_id?: string | number;
  submissionId?: string | number;
  id?: string | number;
  axis_breakdown?: ComplianceAxisBreakdownItem[] | ComplianceAxisBreakdownItem;
  data?: {
    submission_id?: string | number;
    submissionId?: string | number;
    id?: string | number;
    axis_breakdown?:
      | ComplianceAxisBreakdownItem[]
      | ComplianceAxisBreakdownItem;
    axis_id?: string | number;
    axisId?: string | number;
    title?: string | null;
    axis_title?: string | null;
    name?: string | null;
    questions?: ComplianceQuestion[];
    assessment?: {
      axis_breakdown?:
        | ComplianceAxisBreakdownItem[]
        | ComplianceAxisBreakdownItem;
    };
    submission?: {
      submission_id?: string | number;
      submissionId?: string | number;
      id?: string | number;
    };
  };
};

type ComplianceQuestionsResponse = {
  axis_title?: string | null;
  axisTitle?: string | null;
  title?: string | null;
  name?: string | null;
  data?:
    | ComplianceQuestion[]
    | {
        axis_id?: string | number;
        title?: string | null;
        name?: string | null;
        axis_title?: string | null;
        questions?: ComplianceQuestion[];
      };
  questions?: ComplianceQuestion[];
  items?: ComplianceQuestion[];
};

type ComplianceAnswerPayload = {
  question_id: string | number;
  score: number;
  notes?: string;
};

const getComplianceSubmissionStorageKey = (orgId?: string | null) =>
  orgId
    ? `${COMPLIANCE_SUBMISSION_STORAGE_PREFIX}:${orgId}`
    : COMPLIANCE_SUBMISSION_STORAGE_PREFIX;

export const getStoredComplianceSubmissionId = (
  orgId?: string | null,
): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return localStorage.getItem(getComplianceSubmissionStorageKey(orgId));
  } catch {
    return null;
  }
};

export const saveComplianceSubmissionId = (
  submissionId: string,
  orgId?: string | null,
) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(getComplianceSubmissionStorageKey(orgId), submissionId);
};

const extractQuestions = (payload: unknown): ComplianceQuestion[] => {
  if (Array.isArray(payload)) {
    return payload as ComplianceQuestion[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const typedPayload = payload as ComplianceQuestionsResponse;
  if (
    typedPayload.data &&
    typeof typedPayload.data === "object" &&
    !Array.isArray(typedPayload.data)
  ) {
    const nestedQuestions = typedPayload.data.questions;
    if (Array.isArray(nestedQuestions)) {
      return nestedQuestions;
    }
  }

  return (
    (Array.isArray(typedPayload.data) ? typedPayload.data : undefined) ??
    typedPayload.questions ??
    typedPayload.items ??
    []
  );
};

const extractAxisTitle = (payload: unknown): string | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const typedPayload = payload as ComplianceQuestionsResponse;
  if (
    typedPayload.data &&
    typeof typedPayload.data === "object" &&
    !Array.isArray(typedPayload.data)
  ) {
    const nestedTitle =
      typedPayload.data.title ??
      typedPayload.data.axis_title ??
      typedPayload.data.name ??
      null;

    if (nestedTitle) {
      return nestedTitle;
    }
  }

  return (
    typedPayload.axisTitle ??
    typedPayload.axis_title ??
    typedPayload.title ??
    typedPayload.name ??
    null
  );
};

const extractSubmissionId = (payload: unknown): string | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const typedPayload = payload as ComplianceSubmissionResponse;
  const candidate =
    typedPayload.submission_id ??
    typedPayload.submissionId ??
    typedPayload.id ??
    typedPayload.submission?.submission_id ??
    typedPayload.submission?.submissionId ??
    typedPayload.submission?.id ??
    typedPayload.data?.submission_id ??
    typedPayload.data?.submissionId ??
    typedPayload.data?.id ??
    typedPayload.data?.submission?.submission_id ??
    typedPayload.data?.submission?.submissionId ??
    typedPayload.data?.submission?.id;

  return candidate == null ? null : String(candidate);
};

const normalizeAxisId = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return null;
};

const toAxisBreakdownArray = (
  payload:
    | ComplianceAxisBreakdownItem[]
    | ComplianceAxisBreakdownItem
    | undefined,
): ComplianceAxisBreakdownItem[] => {
  if (!payload) {
    return [];
  }

  return Array.isArray(payload) ? payload : [payload];
};

const extractAxisItemFromObject = (
  payload: unknown,
): ComplianceAxisBreakdownItem | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as ComplianceAxisBreakdownItem;
  const axisId = normalizeAxisId(candidate.axis_id ?? candidate.axisId);

  if (!axisId) {
    return null;
  }

  return candidate;
};

const extractAxisQuestionSets = (
  payload: unknown,
): Record<number, ComplianceQuestionSet> => {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  const typedPayload = payload as ComplianceSubmissionResponse;
  const breakdown = [
    ...toAxisBreakdownArray(typedPayload.axis_breakdown),
    ...toAxisBreakdownArray(typedPayload.assessment?.axis_breakdown),
    ...toAxisBreakdownArray(typedPayload.completion?.axes),
    ...toAxisBreakdownArray(typedPayload.data?.axis_breakdown),
    ...toAxisBreakdownArray(typedPayload.data?.assessment?.axis_breakdown),
  ];

  breakdown.sort((a, b) => {
    const orderA =
      typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;
    const orderB =
      typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });

  const topLevelAxis = extractAxisItemFromObject(typedPayload);
  if (topLevelAxis) {
    breakdown.push(topLevelAxis);
  }

  const nestedAxis = extractAxisItemFromObject(typedPayload.data);
  if (nestedAxis) {
    breakdown.push(nestedAxis);
  }

  return breakdown.reduce<Record<number, ComplianceQuestionSet>>(
    (acc, axisItem) => {
      const axisId = normalizeAxisId(axisItem.axis_id ?? axisItem.axisId);
      if (!axisId) {
        return acc;
      }

      const existingAxis = acc[axisId];
      const axisTitle =
        axisItem.title ?? axisItem.axis_title ?? axisItem.name ?? null;
      const nextQuestions = Array.isArray(axisItem.questions)
        ? axisItem.questions
        : [];

      const mergedQuestions =
        nextQuestions.length > 0
          ? nextQuestions
          : (existingAxis?.questions ?? []);

      const mergedTitle = axisTitle ?? existingAxis?.axisTitle ?? null;

      acc[axisId] = {
        axisTitle: mergedTitle,
        questions: mergedQuestions,
      };

      return acc;
    },
    {},
  );
};

const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text) as T;
};

export const initiateComplianceSubmission =
  async (): Promise<ComplianceInitiationResult> => {
    const response = await apiRequest(
      "POST",
      `${COMPLIANCE_API_BASE}/api/compliance/submissions/initiate`,
      {},
    );
    const payload =
      await parseJsonResponse<ComplianceSubmissionResponse>(response);
    const submissionId = extractSubmissionId(payload);
    const axisQuestionSets = extractAxisQuestionSets(payload);

    if (!submissionId && !Object.keys(axisQuestionSets).length) {
      throw new Error("تعذر تحميل جلسة التقييم والأسئلة");
    }

    return {
      submissionId,
      axisQuestionSets,
    };
  };

export const fetchComplianceAxisQuestions = async (
  axisId: number,
): Promise<ComplianceQuestionSet> => {
  const response = await fetch(
    `${COMPLIANCE_API_BASE}/api/compliance/axes/${axisId}/questions`,
    {
      headers: getRequestHeaders(),
    },
  );

  if (!response.ok) {
    const text = (await response.text()) || response.statusText;
    throw new Error(`${response.status}: ${text}`);
  }

  const payload =
    await parseJsonResponse<ComplianceQuestionsResponse>(response);
  return {
    axisTitle: extractAxisTitle(payload),
    questions: extractQuestions(payload),
  };
};

export const submitComplianceAxisAnswers = async (
  submissionId: string,
  axisId: number,
  answers: ComplianceAnswerPayload[],
): Promise<void> => {
  await apiRequest(
    "POST",
    `${COMPLIANCE_API_BASE}/api/compliance/submissions/${submissionId}/axes/${axisId}/answers`,
    { answers },
  );
};

export type FinalReportData = {
  submission?: {
    id?: string | number;
    status?: string;
    overall_score?: number;
    compliance_level?: string;
    compliance_color?: string;
    compliance_message?: string;
    submitted_at?: string | null;
    reviewed_at?: string | null;
    evaluator_notes?: string | null;
    management_action?: string | null;
    management_decision?: string | null;
    reassess_months?: number | null;
  };
  assessment?: {
    id?: string | number;
    title?: string;
    period_year?: string;
  };
  organization?: {
    id?: string | number;
    name?: string;
    type?: string;
  };
  completion?: {
    total_questions?: number;
    answered_questions?: number;
    percentage?: number;
    axes?: Array<{
      axis_id?: string | number;
      title?: string;
      order?: number;
      answered?: number;
      total?: number;
      complete?: boolean;
      axis_score?: number | null;
    }>;
  };
  axis_breakdown?: Array<{
    axis_id?: string | number;
    title?: string;
    order?: number;
    recommendation_platform?: string;
    axis_score?: number | null;
    axis_level?: string;
    axis_color?: string;
    axis_message?: string;
    show_recommendation?: boolean;
    questions?: Array<{
      question_id?: string | number;
      title?: string;
      weight?: number;
      score?: number | null;
      notes?: string | null;
    }>;
  }>;
  recommendations?: Array<{
    id?: string | number;
    title?: string;
    description?: string;
    platform?: string;
  }>;
};

export const fetchFinalReport = async (
  submissionId: string,
): Promise<FinalReportData> => {
  const response = await fetch(
    `${COMPLIANCE_API_BASE}/api/compliance/submissions/${submissionId}/final-report`,
    {
      headers: getRequestHeaders(),
    },
  );

  if (!response.ok) {
    const text = (await response.text()) || response.statusText;
    throw new Error(`${response.status}: ${text}`);
  }

  const payload = await parseJsonResponse<FinalReportData>(response);
  return payload;
};
