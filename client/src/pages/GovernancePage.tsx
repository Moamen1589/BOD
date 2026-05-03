import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  ArrowRight,
  Plus,
  Trash2,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  Shield,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { PillarsAnalysis } from "@/components/PillarsAnalysis";
import { getRequestHeaders, getStoredAuthToken } from "@/lib/queryClient";
import { downloadProgramPdf } from "@/lib/downloadReport";

type Quarter = {
  programCost: string;
  programBudget: string;
  beneficiaries: string;
};

type FormData = {
  programName: string;
  actualCost: string;
  resourceEfficiency: string;
  costPerBeneficiary: string;
  startDate: string;
  endDate: string;
  status: string;
  duration: string;
  quarters: { Q1: Quarter; Q2: Quarter; Q3: Quarter; Q4: Quarter };
};

type ValidationErrors = Record<string, string>;

const emptyQuarter: Quarter = {
  programCost: "",
  programBudget: "",
  beneficiaries: "",
};

const initialForm: FormData = {
  programName: "",
  actualCost: "",
  resourceEfficiency: "",
  costPerBeneficiary: "",
  startDate: "",
  endDate: "",
  status: "جارٍ التنفيذ",
  duration: "",
  quarters: {
    Q1: { ...emptyQuarter },
    Q2: { ...emptyQuarter },
    Q3: { ...emptyQuarter },
    Q4: { ...emptyQuarter },
  },
};

const COLORS = ["#FF6900", "#242423", "#73748C", "#FFF3E8"];
const GOVERNANCE_PROGRAMS_ENDPOINT =
  "https://gold-weasel-489740.hostingersite.com/api/governance/programs";
const GOVERNANCE_QUARTERS_SUFFIX = "/quarters";

const GOVERNANCE_STATUS_MAP: Record<
  string,
  "planning" | "in_progress" | "completed" | "suspended"
> = {
  "في المرحلة التخطيطية": "planning",
  "جارٍ التنفيذ": "in_progress",
  مكتمل: "completed",
  متوقف: "suspended",
};

const GOVERNANCE_STATUS_LABELS = {
  planning: "في المرحلة التخطيطية",
  in_progress: "جارٍ التنفيذ",
  completed: "مكتمل",
  suspended: "متوقف",
} as const;

const MIN_GOVERNANCE_YEAR = 2020;

const normalizeGovernanceStatus = (status: string) => {
  if (status in GOVERNANCE_STATUS_MAP) {
    return status;
  }

  const canonicalEntry = Object.entries(GOVERNANCE_STATUS_MAP).find(
    ([, value]) => value === status,
  );

  return canonicalEntry?.[0] ?? status;
};

const getApiValidationMessage = async (
  response: Response,
  fallbackMessage: string,
) => {
  const payload = await response.json().catch(() => null);
  const yearMessage = payload?.errors?.year?.[0];

  if (yearMessage) {
    return "سنة التقرير يجب أن تكون 2020 أو أكبر.";
  }

  if (typeof payload?.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  return fallbackMessage;
};

function KPICard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: any;
  color: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-md border-r-4 ${color} flex items-start gap-4`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color.replace("border-", "bg-").replace("-500", "-100").replace("-gold", "-light-gold")}`}
      >
        <Icon className={`w-6 h-6 ${color.replace("border-", "text-")}`} />
      </div>
      <div>
        <p className="text-brand-gray text-xs font-bold mb-1">{label}</p>
        <p className="text-brand-dark text-2xl font-black">{value}</p>
        {sub && <p className="text-brand-gray text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function GovernancePage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdProgramId, setCreatedProgramId] = useState<string | null>(null);
  const [programSaved, setProgramSaved] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [activeTab, setActiveTab] = useState<"form" | "results">("form");
  const [loadingRemote, setLoadingRemote] = useState(false);
  const [remoteGovernanceScore, setRemoteGovernanceScore] = useState<null | {
    pillar_impact: number;
    pillar_integrity: number;
    pillar_empowerment: number;
    pillar_innovation: number;
    pillar_capacity: number;
    pillar_sustainability: number;
    overall_score?: number;
  }>(null);

  const setField = (field: keyof Omit<FormData, "quarters">, val: string) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setValidationErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const setQuarterField = (
    q: keyof FormData["quarters"],
    field: keyof Quarter,
    val: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      quarters: {
        ...prev.quarters,
        [q]: { ...prev.quarters[q], [field]: val },
      },
    }));
    const errorKey = `${q}.${field}`;
    setValidationErrors((prev) => {
      if (!prev[errorKey]) return prev;
      const next = { ...prev };
      delete next[errorKey];
      return next;
    });
  };

  const isValidNumber = (value: string, min = 0) => {
    if (value.trim() === "") return false;
    const num = Number(value);
    return !Number.isNaN(num) && num >= min;
  };

  const validateProgramFields = () => {
    const errors: ValidationErrors = {};

    if (!form.programName.trim()) {
      errors.programName = "اسم البرنامج مطلوب";
    }

    if (!isValidNumber(form.actualCost, 0)) {
      errors.actualCost = "أدخل تكلفة فعلية صحيحة (0 أو أكبر)";
    }

    if (
      !isValidNumber(form.resourceEfficiency, 0) ||
      Number(form.resourceEfficiency) > 100
    ) {
      errors.resourceEfficiency = "كفاءة الموارد يجب أن تكون بين 0 و 100";
    }

    if (!isValidNumber(form.duration, 1)) {
      errors.duration = "مدة التنفيذ يجب أن تكون رقمًا أكبر من 0";
    }

    if (!form.startDate) {
      errors.startDate = "تاريخ البدء مطلوب";
    }

    if (!form.endDate) {
      errors.endDate = "تاريخ الانتهاء مطلوب";
    }

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      errors.endDate = "تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء";
    }

    const startYear = Number(form.startDate?.split("-")[0]);
    if (Number.isFinite(startYear) && startYear < MIN_GOVERNANCE_YEAR) {
      errors.startDate = "سنة البدء يجب أن تكون 2020 أو أكبر";
    }

    if (!GOVERNANCE_STATUS_MAP[normalizeGovernanceStatus(form.status)]) {
      errors.status = "حالة المشروع غير صحيحة";
    }

    return errors;
  };

  const validateQuarterFields = () => {
    const errors: ValidationErrors = {};
    const quarterFieldLabels: Record<keyof Quarter, string> = {
      programCost: "تكلفة البرنامج",
      programBudget: "ميزانية البرنامج",
      beneficiaries: "عدد المستفيدين",
    };

    quarterKeys.forEach((q) => {
      (Object.keys(quarterFieldLabels) as Array<keyof Quarter>).forEach(
        (field) => {
          const fieldValue = form.quarters[q][field];
          const key = `${q}.${field}`;

          if (!isValidNumber(fieldValue, 0)) {
            errors[key] =
              `${quarterFieldLabels[field]} في ${quarterLabels[q]} مطلوبة`;
          }
        },
      );
    });

    return errors;
  };

  const createProgram = async () => {
    const response = await fetch(GOVERNANCE_PROGRAMS_ENDPOINT, {
      method: "POST",
      headers: getRequestHeaders(true),
      body: JSON.stringify({
        name: form.programName.trim(),
        status:
          GOVERNANCE_STATUS_MAP[normalizeGovernanceStatus(form.status)] ??
          "planning",
        total_actual_cost: Number(form.actualCost) || 0,
        execution_duration: Number(form.duration) || 0,
        resource_efficiency: Number(form.resourceEfficiency) || 0,
        start_date: form.startDate || null,
        end_date: form.endDate || null,
      }),
    });

    if (!response.ok) {
      throw new Error(
        await getApiValidationMessage(response, "تعذر حفظ البرنامج حالياً."),
      );
    }

    const responseData = await response.json().catch(() => ({}));
    const apiId =
      responseData?.id ??
      responseData?.data?.id ??
      responseData?.program?.id ??
      responseData?.project?.id;

    if (!apiId) {
      throw new Error("PROGRAM_ID_NOT_FOUND");
    }

    const normalizedProgramId = String(apiId);
    setCreatedProgramId(normalizedProgramId);
    setProgramSaved(true);
    localStorage.setItem("governance_program_id", normalizedProgramId);
  };

  const submitProgramQuarters = async (programId: string) => {
    const baseYear =
      Number(form.startDate?.split("-")[0]) || new Date().getFullYear();

    const quarterPayloads = quarterKeys.map((quarterKey) => ({
      quarter: quarterKey,
      year: baseYear,
      budget: Number(form.quarters[quarterKey].programBudget) || 0,
      actual_cost: Number(form.quarters[quarterKey].programCost) || 0,
      beneficiaries: Number(form.quarters[quarterKey].beneficiaries) || 0,
    }));

    await Promise.all(
      quarterPayloads.map(async (payload) => {
        const response = await fetch(
          `${GOVERNANCE_PROGRAMS_ENDPOINT}/${programId}${GOVERNANCE_QUARTERS_SUFFIX}`,
          {
            method: "POST",
            headers: getRequestHeaders(true),
            body: JSON.stringify(payload),
          },
        );

        if (!response.ok) {
          throw new Error(
            await getApiValidationMessage(
              response,
              `تعذر حفظ بيانات ${quarterLabels[payload.quarter]} حالياً.`,
            ),
          );
        }
      }),
    );
  };

  const handleProgramSubmit = async () => {
    setSubmitError(null);

    const programValidationErrors = validateProgramFields();
    if (Object.keys(programValidationErrors).length > 0) {
      setValidationErrors(programValidationErrors);
      setSubmitError("راجع الحقول المطلوبة في بيانات البرنامج.");
      return;
    }

    setValidationErrors({});
    setIsSubmitting(true);

    try {
      await createProgram();
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : "تعذر حفظ البرنامج حالياً. تأكد من البيانات وحاول مرة أخرى.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitError(null);

    const programValidationErrors = validateProgramFields();
    const quarterValidationErrors = validateQuarterFields();
    const mergedErrors = {
      ...programValidationErrors,
      ...quarterValidationErrors,
    };

    if (Object.keys(mergedErrors).length > 0) {
      setValidationErrors(mergedErrors);
      setSubmitError("يرجى تصحيح أخطاء الحقول قبل الإرسال.");
      return;
    }

    setValidationErrors({});

    try {
      let programId = createdProgramId;

      if (!programSaved || !createdProgramId) {
        setIsSubmitting(true);
        await createProgram();
        programId = localStorage.getItem("governance_program_id");
      }

      if (!programId) {
        throw new Error("PROGRAM_ID_NOT_FOUND");
      }

      await submitProgramQuarters(programId);

      setSubmitted(true);
      setActiveTab("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : "تعذر حفظ بيانات البرنامج أو البيانات الربعية حالياً. حاول مرة أخرى.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const quarterKeys = ["Q1", "Q2", "Q3", "Q4"] as const;
  const quarterLabels: Record<string, string> = {
    Q1: "الربع الأول",
    Q2: "الربع الثاني",
    Q3: "الربع الثالث",
    Q4: "الربع الرابع",
  };

  // Computed values for results
  const totalActual = parseFloat(form.actualCost) || 0;
  const totalBudget = quarterKeys.reduce(
    (s, q) => s + (parseFloat(form.quarters[q].programBudget) || 0),
    0,
  );

  // Fetch program details from remote API and populate form when results tab opens
  useEffect(() => {
    const loadRemote = async (programId: string) => {
      try {
        setLoadingRemote(true);
        const res = await fetch(
          `${GOVERNANCE_PROGRAMS_ENDPOINT}/${programId}`,
          {
            headers: getRequestHeaders(false),
          },
        );
        if (!res.ok) return;
        const json = await res.json().catch(() => null);
        const data = json?.data ?? json;
        if (!data) return;

        // map program fields
        setForm((prev) => ({
          ...prev,
          programName: data.name ?? prev.programName,
          actualCost: String(data.total_actual_cost ?? prev.actualCost),
          resourceEfficiency: String(
            data.resource_efficiency ?? prev.resourceEfficiency,
          ),
          costPerBeneficiary: String(
            data.cost_per_beneficiary ?? prev.costPerBeneficiary,
          ),
          startDate: data.start_date ?? prev.startDate,
          endDate: data.end_date ?? prev.endDate,
          status: normalizeGovernanceStatus(data.status ?? prev.status),
          duration: String(data.execution_duration ?? prev.duration),
          quarters: {
            Q1: { ...prev.quarters.Q1 },
            Q2: { ...prev.quarters.Q2 },
            Q3: { ...prev.quarters.Q3 },
            Q4: { ...prev.quarters.Q4 },
          },
        }));

        // map quarters
        if (Array.isArray(data.quarters)) {
          setForm((prev) => {
            const nextQuarters = { ...prev.quarters } as any;
            data.quarters.forEach((q: any) => {
              if (!q.quarter) return;
              nextQuarters[q.quarter] = {
                programCost: String(q.actual_cost ?? q.actualCost ?? ""),
                programBudget: String(q.budget ?? q.program_budget ?? ""),
                beneficiaries: String(q.beneficiaries ?? ""),
              };
            });
            return { ...prev, quarters: nextQuarters };
          });
        }

        // governance score
        if (data.governance_score) {
          setRemoteGovernanceScore({
            pillar_impact: Number(data.governance_score.pillar_impact ?? 0),
            pillar_integrity: Number(
              data.governance_score.pillar_integrity ?? 0,
            ),
            pillar_empowerment: Number(
              data.governance_score.pillar_empowerment ?? 0,
            ),
            pillar_innovation: Number(
              data.governance_score.pillar_innovation ?? 0,
            ),
            pillar_capacity: Number(data.governance_score.pillar_capacity ?? 0),
            pillar_sustainability: Number(
              data.governance_score.pillar_sustainability ?? 0,
            ),
            overall_score: Number(data.governance_score.overall_score ?? 0),
          });
        }
      } catch (e) {
        // ignore
      } finally {
        setLoadingRemote(false);
      }
    };

    if (activeTab === "results") {
      const programId =
        createdProgramId ?? localStorage.getItem("governance_program_id");
      if (programId) loadRemote(programId);
    }
  }, [activeTab, createdProgramId]);
  const totalBeneficiaries = quarterKeys.reduce(
    (s, q) => s + (parseFloat(form.quarters[q].beneficiaries) || 0),
    0,
  );
  const budgetVariance = totalBudget
    ? (((totalBudget - totalActual) / totalBudget) * 100).toFixed(1)
    : "0";
  const efficiency = parseFloat(form.resourceEfficiency) || 0;
  const costPerBene =
    parseFloat(form.costPerBeneficiary) ||
    (totalBeneficiaries ? totalActual / totalBeneficiaries : 0);

  // Pillars scoring — either use remote governance score if available, otherwise compute
  const govPillarScores = remoteGovernanceScore
    ? {
        purpose: remoteGovernanceScore.pillar_impact,
        integrity: remoteGovernanceScore.pillar_integrity,
        empowerment: remoteGovernanceScore.pillar_empowerment,
        innovation: remoteGovernanceScore.pillar_innovation,
        capacity: remoteGovernanceScore.pillar_capacity,
        sustainability: remoteGovernanceScore.pillar_sustainability,
      }
    : {
        purpose: Math.min(
          100,
          Math.round(
            Math.min(100, totalBeneficiaries / 3) * 0.6 +
              (costPerBene > 0 ? Math.min(40, (10000 / costPerBene) * 4) : 20),
          ),
        ),
        integrity: Math.min(
          100,
          Math.round(
            efficiency * 0.6 +
              (totalBudget
                ? Math.min(
                    40,
                    Math.max(
                      0,
                      1 - Math.abs(totalBudget - totalActual) / totalBudget,
                    ) * 40,
                  )
                : 20),
          ),
        ),
        empowerment: Math.min(
          100,
          Math.round(
            totalBudget && totalBeneficiaries
              ? Math.min(
                  100,
                  (totalBeneficiaries / Math.max(1, totalBudget / 10000)) * 30,
                )
              : 0,
          ),
        ),
        innovation:
          form.status === "مكتمل"
            ? 95
            : form.status === "جارٍ التنفيذ"
              ? 70
              : form.status === "في المرحلة التخطيطية"
                ? 45
                : 20,
        capacity: Math.min(
          100,
          Math.round(
            totalBudget && totalActual
              ? totalActual <= totalBudget
                ? 70 + ((totalBudget - totalActual) / totalBudget) * 30
                : Math.max(
                    10,
                    70 - ((totalActual - totalBudget) / totalBudget) * 80,
                  )
              : efficiency * 0.8,
          ),
        ),
        sustainability: Math.min(
          100,
          Math.round(
            (quarterKeys.filter(
              (q) =>
                form.quarters[q].beneficiaries &&
                form.quarters[q].programBudget,
            ).length /
              4) *
              65 +
              (form.duration
                ? Math.min(35, (parseFloat(form.duration) / 90) * 35)
                : 0),
          ),
        ),
      };
  const govPillarIndicators: Record<string, string[]> = {
    purpose: ["عدد المستفيدين", "تكلفة المستفيد", "الأثر المباشر"],
    integrity: ["كفاءة الموارد", "الالتزام بالميزانية", "الشفافية المالية"],
    empowerment: ["نمو المستفيدين", "معدل التغطية"],
    innovation: ["حالة المشروع", "التكيف التشغيلي"],
    capacity: ["الالتزام بالميزانية", "كفاءة الإنفاق"],
    sustainability: ["تغطية الأرباع", "مدة التنفيذ"],
  };

  const chartData = quarterKeys.map((q) => ({
    name: quarterLabels[q],
    "التكلفة الفعلية": parseFloat(form.quarters[q].programCost) || 0,
    الميزانية: parseFloat(form.quarters[q].programBudget) || 0,
    المستفيدون: parseFloat(form.quarters[q].beneficiaries) || 0,
  }));

  const pieData = [
    { name: "مُنفَّق", value: totalActual },
    { name: "متبقي", value: Math.max(0, totalBudget - totalActual) },
  ];

  const renderPieLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, percent, name, value } = props;
    const RAD = Math.PI / 180;
    const radius = outerRadius + 28;
    let x = cx + radius * Math.cos(-midAngle * RAD);
    let y = cy + radius * Math.sin(-midAngle * RAD);

    // clamp to chart bounds to avoid labels being drawn outside svg
    const chartWidth = cx * 2;
    const chartHeight = cy * 2;
    x = Math.max(12, Math.min(chartWidth - 12, x));
    y = Math.max(12, Math.min(chartHeight - 12, y));

    const text = `${name} ${(percent * 100).toFixed(0)}%`;

    return (
      <g>
        <text
          x={x}
          y={y}
          fill="#0f172a"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          style={{
            fontSize: 12,
            fontFamily: "Almarai",
            fontWeight: 800,
            paintOrder: "stroke",
          }}
          stroke="#ffffff"
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {text}
        </text>
        <text
          x={x}
          y={y}
          fill="#0f172a"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          style={{ fontSize: 12, fontFamily: "Almarai", fontWeight: 800 }}
        >
          {text}
        </text>
      </g>
    );
  };

  const statusColor =
    normalizeGovernanceStatus(form.status) ===
    GOVERNANCE_STATUS_LABELS.completed
      ? "text-green-600 bg-green-100"
      : normalizeGovernanceStatus(form.status) ===
          GOVERNANCE_STATUS_LABELS.in_progress
        ? "text-blue-600 bg-blue-100"
        : normalizeGovernanceStatus(form.status) ===
            GOVERNANCE_STATUS_LABELS.suspended
          ? "text-red-600 bg-red-100"
          : "text-amber-600 bg-amber-100";

  return (
    <div
      className="w-full min-h-screen flex flex-col font-almarai bg-[#F5F5F7]"
      dir="rtl"
    >
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-10 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 blur-[100px] -mr-40 -mt-40 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <Link
            href="/ecstt"
            className="inline-flex items-center gap-2 text-white/40 hover:text-brand-gold mb-8 text-sm font-bold transition-colors"
          >
            <ArrowRight className="w-4 h-4" /> المنظومة الاجتماعية
          </Link>
          <div className="flex items-start gap-5 mb-6">
            <div className="bg-brand-gold w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="bg-brand-gold/20 text-brand-gold px-4 py-1 rounded-full text-xs font-black mb-3 inline-block">
                حوكمة مجتمعية
              </span>
              <h1 className="text-3xl md:text-5xl font-black leading-tight">
                نظام حوكمة المشاريع والبرامج
              </h1>
              <p className="text-white/60 mt-3 text-base max-w-2xl">
                أدوات مساءلة وشفافية مالية تفاعلية — أدخل بيانات برنامجك واحصل
                على تقرير حوكمة كامل فوراً
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mt-8">
            {[
              { id: "form", label: "📝 إدخال البيانات" },
              { id: "results", label: "📊 النتائج والتقرير" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-black text-sm transition-all ${activeTab === tab.id ? "bg-brand-gold text-white shadow-lg" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-10 flex-1">
        {activeTab === "form" && (
          <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
            {/* Basic Info */}
            <div className="bg-white rounded-3xl shadow-md p-8">
              <h2 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-gold" /> معلومات
                البرنامج / المشروع
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-brand-dark mb-2">
                    اسم البرنامج / المشروع *
                  </label>
                  <input
                    required
                    value={form.programName}
                    onChange={(e) => setField("programName", e.target.value)}
                    placeholder="مثال: برنامج تدريب الشباب 2025"
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-brand-gold focus:outline-none text-brand-dark text-sm"
                  />
                  {validationErrors.programName && (
                    <p className="text-red-600 text-xs mt-1 font-bold">
                      {validationErrors.programName}
                    </p>
                  )}
                </div>

                {[
                  {
                    label: "تكلفة البرنامج الفعلية (ريال)",
                    field: "actualCost",
                    placeholder: "0.00",
                    type: "number",
                  },
                  {
                    label: "كفاءة استخدام الموارد (%)",
                    field: "resourceEfficiency",
                    placeholder: "0 - 100",
                    type: "number",
                  },
                  {
                    label: "تكلفة المستفيد الفعلية (ريال)",
                    field: "costPerBeneficiary",
                    placeholder: "0.00",
                    type: "number",
                  },
                  {
                    label: "مدة التنفيذ (بالأيام)",
                    field: "duration",
                    placeholder: "0",
                    type: "number",
                  },
                ].map(({ label, field, placeholder, type }) => (
                  <div key={field}>
                    <label className="block text-xs font-black text-brand-dark mb-2">
                      {label}
                    </label>
                    <input
                      type={type}
                      value={(form as any)[field]}
                      onChange={(e) => setField(field as any, e.target.value)}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-brand-gold focus:outline-none text-brand-dark text-sm"
                    />
                    {validationErrors[field] && (
                      <p className="text-red-600 text-xs mt-1 font-bold">
                        {validationErrors[field]}
                      </p>
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-black text-brand-dark mb-2">
                    تاريخ البدء
                  </label>
                  <input
                    required
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setField("startDate", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-brand-gold focus:outline-none text-brand-dark text-sm"
                  />
                  {validationErrors.startDate && (
                    <p className="text-red-600 text-xs mt-1 font-bold">
                      {validationErrors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-black text-brand-dark mb-2">
                    تاريخ الانتهاء
                  </label>
                  <input
                    required
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setField("endDate", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-brand-gold focus:outline-none text-brand-dark text-sm"
                  />
                  {validationErrors.endDate && (
                    <p className="text-red-600 text-xs mt-1 font-bold">
                      {validationErrors.endDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-black text-brand-dark mb-2">
                    حالة المشروع
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setField("status", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-brand-gold focus:outline-none text-brand-dark text-sm bg-white"
                  >
                    {[
                      "مكتمل",
                      "جارٍ التنفيذ",
                      "في المرحلة التخطيطية",
                      "متوقف",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  {validationErrors.status && (
                    <p className="text-red-600 text-xs mt-1 font-bold">
                      {validationErrors.status}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Button
                    type="button"
                    onClick={handleProgramSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-brand-dark hover:bg-brand-dark/90 text-white py-4 rounded-2xl font-black text-base disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting
                      ? "جارٍ حفظ البرنامج..."
                      : "حفظ البرنامج / المشروع"}
                  </Button>
                </div>

                {createdProgramId && (
                  <div className="md:col-span-2 rounded-xl border border-green-200 bg-green-50 text-green-700 px-4 py-3 text-sm font-bold">
                    تم ربط البرنامج بنجاح
                  </div>
                )}
              </div>
            </div>

            {/* Quarters */}
            <div className="bg-white rounded-3xl shadow-md p-8">
              <h2 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-gold" /> البيانات
                الربعية
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quarterKeys.map((q) => (
                  <div
                    key={q}
                    className="bg-brand-light rounded-2xl p-5 border-2 border-brand-gold/10"
                  >
                    <h3 className="font-black text-brand-dark text-sm mb-4 flex items-center gap-2">
                      <span className="bg-brand-gold text-white w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black">
                        {q}
                      </span>
                      {quarterLabels[q]}
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          label: "تكلفة البرنامج (ريال)",
                          field: "programCost",
                        },
                        {
                          label: "ميزانية البرنامج (ريال)",
                          field: "programBudget",
                        },
                        { label: "عدد المستفيدين", field: "beneficiaries" },
                      ].map(({ label, field }) => (
                        <div key={field}>
                          <label className="block text-xs font-bold text-brand-gray mb-1">
                            {label}
                          </label>
                          <input
                            type="number"
                            placeholder="0"
                            value={(form.quarters[q] as any)[field]}
                            onChange={(e) =>
                              setQuarterField(q, field as any, e.target.value)
                            }
                            className="w-full px-3 py-2.5 border-2 border-gray-100 rounded-xl focus:border-brand-gold focus:outline-none text-brand-dark text-sm bg-white"
                          />
                          {validationErrors[`${q}.${field}`] && (
                            <p className="text-red-600 text-xs mt-1 font-bold">
                              {validationErrors[`${q}.${field}`]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {submitError && (
              <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm font-bold">
                {submitError}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !createdProgramId}
              className="w-full bg-brand-gold hover:bg-brand-gold-dark text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-brand-gold/30 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <BarChart3 className="w-5 h-5" />{" "}
              {isSubmitting ? "جارٍ إنشاء البرنامج..." : "إنشاء تقرير الحوكمة"}
            </Button>
          </form>
        )}

        {activeTab === "results" && !submitted && (
          <div className="max-w-xl mx-auto text-center py-24">
            <div className="w-20 h-20 bg-brand-light-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-10 h-10 text-brand-gold" />
            </div>
            <h3 className="text-2xl font-black text-brand-dark mb-3">
              لا توجد بيانات بعد
            </h3>
            <p className="text-brand-gray mb-6">
              أدخل بيانات البرنامج في تبويب "إدخال البيانات" لعرض التقرير
            </p>
            <Button
              onClick={() => setActiveTab("form")}
              className="bg-brand-gold text-white px-8 py-4 rounded-2xl font-black"
            >
              ابدأ الإدخال
            </Button>
          </div>
        )}

        {activeTab === "results" && submitted && (
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="bg-brand-dark rounded-3xl p-8 text-white flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-white/50 text-sm font-bold mb-1">
                  تقرير حوكمة المشروع
                </p>
                <h2 className="text-3xl font-black">
                  {form.programName || "البرنامج"}
                </h2>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-black ${statusColor}`}
                  >
                    {form.status}
                  </span>
                  {form.startDate && (
                    <span className="text-white/40 text-xs">
                      {form.startDate} — {form.endDate}
                    </span>
                  )}
                  {form.duration && (
                    <span className="text-white/40 text-xs">
                      مدة التنفيذ: {form.duration} يوم
                    </span>
                  )}
                </div>
              </div>
              <Button
                onClick={() => setActiveTab("form")}
                className="bg-white text-brand-dark hover:bg-white/90 rounded-xl font-black text-sm px-4 py-3 shadow-lg"
              >
                تعديل البيانات
              </Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                label="التكلفة الفعلية الإجمالية"
                value={`${totalActual.toLocaleString()} ر.س`}
                icon={DollarSign}
                color="border-brand-gold text-brand-gold"
              />
              <KPICard
                label="إجمالي الميزانية المخططة"
                value={`${totalBudget.toLocaleString()} ر.س`}
                sub={`فرق: ${budgetVariance}%`}
                icon={TrendingUp}
                color="border-blue-500 text-blue-500"
              />
              <KPICard
                label="إجمالي المستفيدين"
                value={totalBeneficiaries.toLocaleString()}
                icon={Users}
                color="border-green-500 text-green-500"
              />
              <KPICard
                label="كفاءة استخدام الموارد"
                value={`${efficiency}%`}
                sub={
                  efficiency >= 80
                    ? "✅ أداء ممتاز"
                    : efficiency >= 60
                      ? "⚠️ يحتاج تحسين"
                      : "❌ أداء ضعيف"
                }
                icon={CheckCircle2}
                color={
                  efficiency >= 80
                    ? "border-green-500 text-green-500"
                    : efficiency >= 60
                      ? "border-amber-500 text-amber-500"
                      : "border-red-500 text-red-500"
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <KPICard
                label="تكلفة المستفيد الفعلية"
                value={`${costPerBene.toFixed(0)} ر.س`}
                sub="لكل مستفيد"
                icon={DollarSign}
                color="border-purple-500 text-purple-500"
              />
              <KPICard
                label="نسبة الإنفاق من الميزانية"
                value={
                  totalBudget
                    ? `${((totalActual / totalBudget) * 100).toFixed(1)}%`
                    : "—"
                }
                sub={
                  Number(budgetVariance) > 0
                    ? `وفورات: ${Math.abs(Number(budgetVariance))}%`
                    : `تجاوز: ${Math.abs(Number(budgetVariance))}%`
                }
                icon={BarChart3}
                color="border-orange-500 text-orange-500"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bar Chart - Quarterly */}
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-md p-7">
                <h3 className="font-black text-brand-dark mb-5">
                  التكاليف والميزانية ربعياً
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fontFamily: "Almarai" }}
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v) => v.toLocaleString()}
                    />
                    <Tooltip
                      formatter={(v: any) =>
                        `${Number(v).toLocaleString()} ر.س`
                      }
                    />
                    <Legend />
                    <Bar
                      dataKey="التكلفة الفعلية"
                      fill="#FF6900"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="الميزانية"
                      fill="#242423"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie - Budget */}
              <div className="bg-white rounded-3xl shadow-md p-7">
                <h3 className="font-black text-brand-dark mb-5">
                  توزيع الميزانية
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      label={renderPieLabel}
                      labelLine={true}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: any) =>
                        `${Number(v).toLocaleString()} ر.س`
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-2">
                  <p className="text-xs text-brand-gray font-bold">
                    إجمالي الميزانية
                  </p>
                  <p className="text-xl font-black text-brand-dark">
                    {totalBudget.toLocaleString()} ر.س
                  </p>
                </div>
              </div>
            </div>

            {/* Beneficiaries Line Chart */}
            <div className="bg-white rounded-3xl shadow-md p-7">
              <h3 className="font-black text-brand-dark mb-5">
                نمو المستفيدين ربعياً
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fontFamily: "Almarai" }}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="المستفيدون"
                    stroke="#FF6900"
                    strokeWidth={3}
                    dot={{ fill: "#FF6900", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Governance Score */}
            <div className="bg-brand-dark rounded-3xl p-8 text-white">
              <h3 className="font-black text-xl mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-gold" /> مؤشر الحوكمة
              </h3>
              {[
                {
                  label: "كفاءة الإنفاق المالي",
                  val: totalBudget
                    ? Math.min(100, (totalActual / totalBudget) * 100)
                    : 0,
                  good: (v: number) => v <= 100 && v >= 80,
                },
                {
                  label: "كفاءة استخدام الموارد",
                  val: efficiency,
                  good: (v: number) => v >= 75,
                },
                {
                  label: "تكلفة المستفيد",
                  val:
                    costPerBene > 0
                      ? Math.min(100, 100 - (costPerBene / 1000) * 10)
                      : 0,
                  good: (v: number) => v >= 60,
                },
              ].map(({ label, val, good }) => (
                <div key={label} className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 text-sm font-bold">
                      {label}
                    </span>
                    <span
                      className={`font-black text-sm ${good(val) ? "text-green-400" : "text-amber-400"}`}
                    >
                      {val.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-700 ${good(val) ? "bg-green-400" : "bg-amber-400"}`}
                      style={{ width: `${Math.min(100, val)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Pillars Analysis */}
            <PillarsAnalysis
              scores={govPillarScores}
              indicators={govPillarIndicators}
              systemName="نظام حوكمة المشاريع والبرامج"
            />

            <Button
              onClick={async () => {
                const programId =
                  createdProgramId ??
                  localStorage.getItem("governance_program_id");
                if (!programId) {
                  alert(
                    "لم يتم حفظ معرف البرنامج بعد. احفظ البرنامج أولاً ثم حاول التصدير.",
                  );
                  return;
                }
                try {
                  const token = getStoredAuthToken();
                  console.log(token);

                  await downloadProgramPdf(programId, token ?? undefined);
                } catch (e) {
                  // eslint-disable-next-line no-console
                  console.error(e);
                  alert("فشل تحميل التقرير من الخادم.");
                }
              }}
              variant="outline"
              className="w-full border-2 border-brand-dark text-brand-dark py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-brand-dark hover:text-white transition-all"
            >
              <Download className="w-4 h-4" /> تحميل تقرير الحوكمة
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
