import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProgramInfoForm } from "@/components/ProgramInfoForm";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { getRequestHeaders } from "@/lib/queryClient";
import {
  GOVERNANCE_PROGRAMS_ENDPOINT,
  GOVERNANCE_STATUS_MAP,
  validateProgramFields,
  type ValidationErrors,
} from "@/lib/programValidation";
import {
  ArrowRight,
  Plus,
  Trash2,
  TrendingUp,
  Users,
  Heart,
  Target,
  Zap,
  DollarSign,
  BarChart3,
  Download,
  Sparkles,
  Globe,
} from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";

type Benefit = { name: string; value: string };

type FormData = {
  programName: string;
  beneficiaries: string;
  satisfactionRate: string;
  improvementRate: string;
  inclusionIndex: string;
  volunteerHours: string;
  actualCost: string;
  resourceEfficiency: string;
  costPerBeneficiary: string;
  startDate: string;
  endDate: string;
  status: string;
  duration: string;
  benefits: Benefit[];
};

const initialForm: FormData = {
  programName: "",
  beneficiaries: "",
  satisfactionRate: "",
  improvementRate: "",
  inclusionIndex: "",
  volunteerHours: "",
  actualCost: "",
  resourceEfficiency: "",
  costPerBeneficiary: "",
  startDate: "",
  endDate: "",
  status: "جارٍ التنفيذ",
  duration: "",
  benefits: [{ name: "", value: "" }],
};

function GaugeMeter({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  const clamp = Math.min(100, Math.max(0, value));
  const getColor = (v: number) =>
    v >= 80 ? "#22c55e" : v >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div className="text-center">
      <div className="relative w-28 h-28 mx-auto mb-3">
        <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={getColor(clamp)}
            strokeWidth="3"
            strokeDasharray={`${clamp}, 100`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-brand-dark">
            {clamp.toFixed(0)}%
          </span>
        </div>
      </div>
      <p className="text-xs font-bold text-brand-gray">{label}</p>
    </div>
  );
}

function KPICard({
  label,
  value,
  sub,
  icon: Icon,
  colorClass,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: any;
  colorClass: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-md border-r-4 ${colorClass} flex items-start gap-4`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass.replace("border-", "bg-").replace("-500", "-100").replace("-gold", "-light-gold")}`}
      >
        <Icon className={`w-6 h-6 ${colorClass.replace("border-", "text-")}`} />
      </div>
      <div>
        <p className="text-brand-gray text-xs font-bold mb-1">{label}</p>
        <p className="text-brand-dark text-2xl font-black">{value}</p>
        {sub && <p className="text-brand-gray text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function ImpactPage() {
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
  const [apiResults, setApiResults] = useState<any>(null);

  const setField = (field: keyof Omit<FormData, "benefits">, val: string) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setValidationErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const setBenefit = (i: number, field: keyof Benefit, val: string) =>
    setForm((prev) => {
      const benefits = [...prev.benefits];
      benefits[i] = { ...benefits[i], [field]: val };
      return { ...prev, benefits };
    });

  const addBenefit = () =>
    setForm((prev) => ({
      ...prev,
      benefits: [...prev.benefits, { name: "", value: "" }],
    }));
  const removeBenefit = (i: number) =>
    setForm((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, idx) => idx !== i),
    }));

  const isValidNumber = (value: string, min = 0) => {
    if (value.trim() === "") return false;
    const num = Number(value);
    return !Number.isNaN(num) && num >= min;
  };

  const validateSocialImpactFields = () => {
    const errors: ValidationErrors = {};

    if (!isValidNumber(form.beneficiaries, 0)) {
      errors.beneficiaries = "عدد المستفيدين يجب أن يكون رقمًا صحيحًا";
    }

    if (
      !isValidNumber(form.satisfactionRate, 0) ||
      Number(form.satisfactionRate) > 100
    ) {
      errors.satisfactionRate = "معدل الرضا يجب أن يكون بين 0 و 100";
    }

    if (
      !isValidNumber(form.improvementRate, 0) ||
      Number(form.improvementRate) > 100
    ) {
      errors.improvementRate = "نسبة التحسين يجب أن تكون بين 0 و 100";
    }

    if (
      !isValidNumber(form.inclusionIndex, 0) ||
      Number(form.inclusionIndex) > 100
    ) {
      errors.inclusionIndex = "مؤشر الشمول يجب أن يكون بين 0 و 100";
    }

    if (!isValidNumber(form.volunteerHours, 0)) {
      errors.volunteerHours = "ساعات التطوع يجب أن تكون رقمًا صحيحًا";
    }

    // Validate benefits
    const validBenefits = form.benefits.filter(
      (b) => b.name.trim() && b.value.trim(),
    );
    if (validBenefits.length === 0) {
      errors.benefits = "أضف منفعة اجتماعية واحدة على الأقل";
    }

    return errors;
  };

  const createProgram = async () => {
    const response = await fetch(GOVERNANCE_PROGRAMS_ENDPOINT, {
      method: "POST",
      headers: getRequestHeaders(true),
      body: JSON.stringify({
        name: form.programName.trim(),
        status: GOVERNANCE_STATUS_MAP[form.status] ?? "planning",
        total_actual_cost: Number(form.actualCost) || 0,
        execution_duration: Number(form.duration) || 0,
        resource_efficiency: Number(form.resourceEfficiency) || 0,
        start_date: form.startDate || null,
        end_date: form.endDate || null,
      }),
    });

    if (!response.ok) {
      throw new Error("PROGRAM_CREATE_FAILED");
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
    localStorage.setItem("impact_program_id", normalizedProgramId);
  };

  const submitSocialImpact = async (programId: string) => {
    const validBenefits = form.benefits
      .filter((b) => b.name.trim() && b.value.trim())
      .map((b) => ({
        name: b.name.trim(),
        value: parseFloat(b.value) || 0,
      }));

    const endpoint = `https://gold-weasel-489740.hostingersite.com/api/programs/social-impact/programs/${programId}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: getRequestHeaders(true),
      body: JSON.stringify({
        beneficiaries: parseInt(form.beneficiaries) || 0,
        satisfaction_rate: parseFloat(form.satisfactionRate) || 0,
        improvement_rate: parseFloat(form.improvementRate) || 0,
        inclusion_index: parseFloat(form.inclusionIndex) || 0,
        volunteer_hours: parseFloat(form.volunteerHours) || 0,
        benefits: validBenefits,
      }),
    });

    if (!response.ok) {
      throw new Error("SOCIAL_IMPACT_SUBMIT_FAILED");
    }

    const result = await response.json().catch(() => ({}));
    setApiResults(result);
    return result;
  };

  const handleProgramSubmit = async () => {
    setSubmitError(null);

    const programValidationErrors = validateProgramFields(form);
    if (Object.keys(programValidationErrors).length > 0) {
      setValidationErrors(programValidationErrors);
      setSubmitError("راجع الحقول المطلوبة في بيانات البرنامج.");
      return;
    }

    setValidationErrors({});
    setIsSubmitting(true);

    try {
      await createProgram();
    } catch {
      setSubmitError(
        "تعذر حفظ البرنامج حالياً. تأكد من البيانات وحاول مرة أخرى.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitError(null);

    const programValidationErrors = validateProgramFields(form);
    if (Object.keys(programValidationErrors).length > 0) {
      setValidationErrors(programValidationErrors);
      setSubmitError("يرجى تصحيح أخطاء بيانات البرنامج قبل الإرسال.");
      return;
    }

    const socialImpactErrors = validateSocialImpactFields();
    if (Object.keys(socialImpactErrors).length > 0) {
      setValidationErrors(socialImpactErrors);
      setSubmitError("يرجى تصحيح أخطاء بيانات الأثر الاجتماعي قبل الإرسال.");
      return;
    }

    setValidationErrors({});

    try {
      let programId = createdProgramId;

      if (!programSaved || !programId) {
        setIsSubmitting(true);
        await createProgram();
        programId = createdProgramId;
      }

      if (!programId) {
        setSubmitError("تعذر الحصول على معرّف البرنامج. حاول مرة أخرى.");
        return;
      }

      // Submit social impact data
      await submitSocialImpact(programId);

      setSubmitted(true);
      setActiveTab("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError(
        "حدث خطأ أثناء إرسال البيانات. تأكد من صحة المدخلات وحاول مرة أخرى.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Computed - استخدم بيانات API عند توفرها
  const n = (v: string | number) => {
    if (typeof v === "number") return v;
    return parseFloat(v) || 0;
  };

  // من API إذا كانت النتائج موجودة، وإلا من form
  const beneficiaries = apiResults?.beneficiaries ?? n(form.beneficiaries);
  const satisfaction =
    apiResults?.satisfaction_rate ?? n(form.satisfactionRate);
  const improvement = apiResults?.improvement_rate ?? n(form.improvementRate);
  const inclusion = apiResults?.inclusion_index ?? n(form.inclusionIndex);
  const volunteerHours = apiResults?.volunteer_hours ?? n(form.volunteerHours);
  const volunteerIndex = apiResults?.volunteer_index ?? 0;
  const actualCost = n(form.actualCost);
  const totalBenefitsValue =
    apiResults?.total_benefits_value ??
    form.benefits.reduce((s, b) => s + n(b.value), 0);
  const sroi =
    apiResults?.sroi !== undefined
      ? apiResults.sroi.toFixed(4)
      : actualCost > 0
        ? (totalBenefitsValue / actualCost).toFixed(4)
        : "—";
  const avgScore =
    apiResults?.avg_score ??
    (
      (satisfaction +
        improvement +
        inclusion +
        (volunteerHours > 0 ? Math.min(100, volunteerHours / 10) : 0)) /
      4
    ).toFixed(1);

  const radarData = [
    { subject: "الرضا", A: satisfaction },
    { subject: "التحسين", A: improvement },
    { subject: "الشمول", A: inclusion },
    {
      subject: "التطوع",
      A: Math.min(100, volunteerIndex || volunteerHours / 10),
    },
  ];

  const barData = (apiResults?.benefits ?? form.benefits)
    .filter(
      (b: any) =>
        b.name && (typeof b.value === "number" ? b.value > 0 : b.value.trim()),
    )
    .map((b: any) => ({
      name: b.name.length > 14 ? b.name.slice(0, 14) + "…" : b.name,
      value: n(b.value),
    }));

  const areaData = [
    { name: "قبل البرنامج", تأثير: 30 },
    { name: "منتصف البرنامج", تأثير: Math.max(40, improvement * 0.6) },
    { name: "بعد البرنامج", تأثير: Math.max(50, improvement) },
    { name: "مستقبلي (AI)", تأثير: Math.min(100, improvement * 1.2) },
  ];

  const aiInsight = () => {
    return (
      apiResults?.ai_insight ??
      (() => {
        if (satisfaction >= 85 && improvement >= 70)
          return "أثر مجتمعي ممتاز — البرنامج يحقق نتائج استثنائية ويُوصى باستدامته وتوسيع نطاقه.";
        if (satisfaction >= 70)
          return "أثر مجتمعي جيد — البرنامج يحقق نتائج إيجابية مع فرص للتحسين في مجال الشمول الاجتماعي.";
        if (improvement < 50)
          return "أثر محدود — يُنصح بمراجعة آليات التنفيذ والتدخل المبكر لتحسين النتائج.";
        return "أثر متوسط — البرنامج بحاجة لتحليل أعمق لفهم أسباب محدودية الأثر والعمل على معالجتها.";
      })()
    );
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col font-almarai bg-[#F5F5F7]"
      dir="rtl"
    >
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-10 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 blur-[100px] -ml-40 -mt-40 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <Link
            href="/ecstt"
            className="inline-flex items-center gap-2 text-white/40 hover:text-brand-gold mb-8 text-sm font-bold transition-colors"
          >
            <ArrowRight className="w-4 h-4" /> المنظومة الاجتماعية
          </Link>
          <div className="flex items-start gap-5 mb-6">
            <div className="bg-purple-500 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="bg-purple-500/20 text-purple-300 px-4 py-1 rounded-full text-xs font-black mb-3 inline-block">
                قياس الأثر
              </span>
              <h1 className="text-3xl md:text-5xl font-black leading-tight">
                نظام قياس الأثر المجتمعي
              </h1>
              <p className="text-white/60 mt-3 text-base max-w-2xl">
                لوحة تحكم تفاعلية بالذكاء الاصطناعي لقياس وتحليل الأثر المجتمعي
                الحقيقي لبرامجك
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            {[
              { id: "form", label: "📝 إدخال مؤشرات الأثر" },
              { id: "results", label: "🤖 لوحة التحليل AI" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-black text-sm transition-all ${activeTab === tab.id ? "bg-purple-500 text-white shadow-lg" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
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
            {/* Program Info */}
            <ProgramInfoForm
              form={form}
              validationErrors={validationErrors}
              isSubmitting={isSubmitting}
              onFieldChange={setField}
              onSaveProgram={handleProgramSubmit}
              showSaveButton={true}
              savedMessage={createdProgramId ? "تم ربط البرنامج بنجاح" : ""}
              colorClass="purple-500"
            />

            {/* Social Impact Inputs */}
            <div className="bg-white rounded-3xl shadow-md p-8">
              <h2 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" /> قياس الأثر
                الاجتماعي
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-black text-brand-dark mb-2">
                    عدد المستفيدين *
                  </label>
                  <input
                    required
                    type="number"
                    value={form.beneficiaries}
                    onChange={(e) => setField("beneficiaries", e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-purple-500 focus:outline-none text-brand-dark text-sm"
                  />
                  {validationErrors.beneficiaries && (
                    <p className="text-red-600 text-xs mt-1 font-bold">
                      {validationErrors.beneficiaries}
                    </p>
                  )}
                </div>

                {[
                  {
                    label: "معدل الرضا الاجتماعي (%)",
                    field: "satisfactionRate",
                    desc: "نسبة المستفيدين الراضين عن البرنامج",
                  },
                  {
                    label: "نسبة التحسين بعد البرامج (%)",
                    field: "improvementRate",
                    desc: "التحسن الملاحظ في المستفيدين",
                  },
                  {
                    label: "مؤشر الشمول الاجتماعي (%)",
                    field: "inclusionIndex",
                    desc: "مدى وصول البرنامج للفئات المستهدفة",
                  },
                  {
                    label: "معدل عدد ساعات التطوع",
                    field: "volunteerHours",
                    desc: "متوسط ساعات التطوع لكل متطوع",
                  },
                ].map(({ label, field, desc }) => (
                  <div key={field}>
                    <label className="block text-xs font-black text-brand-dark mb-1">
                      {label}
                    </label>
                    <p className="text-brand-gray text-xs mb-2">{desc}</p>
                    <input
                      type="number"
                      value={(form as any)[field]}
                      onChange={(e) => setField(field as any, e.target.value)}
                      placeholder="0"
                      min="0"
                      max={field !== "volunteerHours" ? "100" : undefined}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-purple-500 focus:outline-none text-brand-dark text-sm"
                    />
                    {validationErrors[field] && (
                      <p className="text-red-600 text-xs mt-1 font-bold">
                        {validationErrors[field]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Social Benefits */}
            <div className="bg-white rounded-3xl shadow-md p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-brand-dark flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" /> المنافع الاجتماعية
                </h2>
                <Button
                  type="button"
                  onClick={addBenefit}
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50 rounded-xl text-sm font-bold flex items-center gap-2 px-4 py-2 h-auto"
                >
                  <Plus className="w-4 h-4" /> إضافة منفعة
                </Button>
              </div>
              <div className="space-y-4">
                {form.benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-brand-gray mb-1">
                          اسم المنفعة الاجتماعية
                        </label>
                        <input
                          type="text"
                          value={benefit.name}
                          onChange={(e) =>
                            setBenefit(i, "name", e.target.value)
                          }
                          placeholder="مثال: توفير وجبات غذائية"
                          className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-purple-500 focus:outline-none text-brand-dark text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-brand-gray mb-1">
                          قيمة المنفعة الاجتماعية (ريال)
                        </label>
                        <input
                          type="number"
                          value={benefit.value}
                          onChange={(e) =>
                            setBenefit(i, "value", e.target.value)
                          }
                          placeholder="0.00"
                          className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-purple-500 focus:outline-none text-brand-dark text-sm"
                        />
                      </div>
                    </div>
                    {form.benefits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBenefit(i)}
                        className="mt-6 p-2.5 bg-red-50 text-red-400 hover:bg-red-100 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {validationErrors.benefits && (
                <p className="text-red-600 text-xs mt-3 font-bold">
                  {validationErrors.benefits}
                </p>
              )}
            </div>

            {submitError && (
              <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm font-bold">
                {submitError}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !createdProgramId}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5" /> تحليل الأثر
            </Button>
          </form>
        )}

        {activeTab === "results" && !submitted && (
          <div className="max-w-xl mx-auto text-center py-24">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-purple-500" />
            </div>
            <h3 className="text-2xl font-black text-brand-dark mb-3">
              لا توجد بيانات للتحليل
            </h3>
            <p className="text-brand-gray mb-6">
              أدخل مؤشرات الأثر لتشغيل التحليل
            </p>
            <Button
              onClick={() => setActiveTab("form")}
              className="bg-purple-500 text-white px-8 py-4 rounded-2xl font-black"
            >
              ابدأ الإدخال
            </Button>
          </div>
        )}

        {activeTab === "results" && submitted && (
          <div className="max-w-5xl mx-auto space-y-8">
            {/* AI Insight Banner */}
            <div className="bg-gradient-to-l from-purple-600 to-purple-800 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 pointer-events-none" />
              <div className="relative z-10 flex items-start gap-4">
                <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-purple-200 text-xs font-black mb-2">
                    تحليل الاثر
                  </p>
                  <p className="text-white font-bold text-lg leading-relaxed">
                    {aiInsight()}
                  </p>
                  <div className="flex items-center gap-4 mt-4 flex-wrap">
                    <span className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-black">
                      مؤشر الأثر الكلي: {avgScore}%
                    </span>
                    <span className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-black">
                      معدل العائد الاجتماعي: {sroi}x
                    </span>
                    <span className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-black">
                      {beneficiaries.toLocaleString()} مستفيد
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <KPICard
                label="عدد المستفيدين"
                value={beneficiaries.toLocaleString()}
                icon={Users}
                colorClass="border-blue-500 text-blue-500"
              />
              <KPICard
                label="إجمالي قيمة المنافع"
                value={`${totalBenefitsValue.toLocaleString()} ر.س`}
                icon={Heart}
                colorClass="border-rose-500 text-rose-500"
              />
              <KPICard
                label="معدل العائد الاجتماعي (SROI)"
                value={`${sroi}x`}
                sub="لكل ريال يُنفَق"
                icon={TrendingUp}
                colorClass="border-purple-500 text-purple-500"
              />
              <KPICard
                label="التكلفة الفعلية"
                value={`${actualCost.toLocaleString()} ر.س`}
                icon={DollarSign}
                colorClass="border-amber-500 text-amber-500"
              />
              <KPICard
                label="تكلفة المستفيد الواحد"
                value={
                  beneficiaries > 0
                    ? `${(actualCost / beneficiaries).toFixed(0)} ر.س`
                    : "—"
                }
                icon={Zap}
                colorClass="border-green-500 text-green-500"
              />
              <KPICard
                label="مؤشر الأثر الكلي"
                value={`${avgScore}%`}
                sub={
                  apiResults?.classification ??
                  (Number(avgScore) >= 75
                    ? "أثر ممتاز ✅"
                    : Number(avgScore) >= 55
                      ? "أثر جيد ⚠️"
                      : "يحتاج تحسين ❌")
                }
                icon={Target}
                colorClass="border-brand-gold text-brand-gold"
              />
            </div>

            {/* Gauges */}
            <div className="bg-white rounded-3xl shadow-md p-8">
              <h3 className="font-black text-brand-dark mb-8">
                مؤشرات الأثر التفصيلية
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <GaugeMeter
                  value={satisfaction}
                  label="معدل الرضا الاجتماعي"
                  color="blue"
                />
                <GaugeMeter
                  value={improvement}
                  label="نسبة التحسين"
                  color="green"
                />
                <GaugeMeter
                  value={inclusion}
                  label="مؤشر الشمول"
                  color="purple"
                />
                <GaugeMeter
                  value={Math.min(100, volunteerHours / 10)}
                  label="معدل التطوع"
                  color="orange"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar */}
              <div className="bg-white rounded-3xl shadow-md p-7">
                <h3 className="font-black text-brand-dark mb-5">
                  مخطط الأثر الشامل
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fontSize: 11, fontFamily: "Almarai" }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fontSize: 9 }}
                    />
                    <Radar
                      name="الأثر"
                      dataKey="A"
                      stroke="#9333ea"
                      fill="#9333ea"
                      fillOpacity={0.25}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Area - Impact Over Time */}
              <div className="bg-white rounded-3xl shadow-md p-7">
                <h3 className="font-black text-brand-dark mb-2">
                  مسار الأثر عبر الزمن
                </h3>
                <p className="text-brand-gray text-xs mb-4">
                  📈 التوقع المستقبلي مبني على نماذج الذكاء الاصطناعي
                </p>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={areaData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fontFamily: "Almarai" }}
                    />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="تأثير"
                      stroke="#9333ea"
                      fill="#9333ea"
                      fillOpacity={0.15}
                      strokeWidth={2.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Benefits Bar */}
            {barData.length > 0 && (
              <div className="bg-white rounded-3xl shadow-md p-7">
                <h3 className="font-black text-brand-dark mb-5">
                  قيمة المنافع الاجتماعية
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fontFamily: "Almarai" }}
                    />
                    <YAxis
                      tickFormatter={(v) => `${v.toLocaleString()}`}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip
                      formatter={(v: any) =>
                        `${Number(v).toLocaleString()} ر.س`
                      }
                    />
                    <Bar
                      dataKey="value"
                      fill="#9333ea"
                      radius={[8, 8, 0, 0]}
                      name="القيمة"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <Button
              onClick={() => window.print()}
              variant="outline"
              className="w-full border-2 border-brand-dark text-brand-dark py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-brand-dark hover:text-white transition-all"
            >
              <Download className="w-4 h-4" /> تصدير تقرير الأثر
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
