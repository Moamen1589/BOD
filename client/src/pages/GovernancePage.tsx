import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  ArrowRight,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Shield,
  Zap,
  Globe,
  Heart,
  Target,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Star,
  Handshake,
  Lightbulb,
  Activity,
} from "lucide-react";

type IndicatorKey = string;
type PerformanceData = Record<IndicatorKey, string>;

const categories = [
  {
    key: "finance",
    name: "المالية",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    badgeColor: "bg-green-100 text-green-700",
    indicators: [
      { key: "adminExpenses", label: "نسبة المصاريف الإدارية من إجمالي المصاريف" },
      { key: "programExpenses", label: "نسبة المصاريف على البرامج من إجمالي المصاريف" },
      { key: "sustainableRevenue", label: "نسبة الإيرادات المستدامة من إجمالي الإيرادات" },
      { key: "budgetDeviation", label: "نسبة الانحراف عن الميزانية المعتمدة" },
      { key: "revenueGrowth", label: "معدل نمو الإيرادات السنوي" },
    ],
  },
  {
    key: "operations",
    name: "التشغيل",
    icon: Target,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
    indicators: [
      { key: "operationalPlan", label: "مستوى الالتزام بالخطة التشغيلية" },
      { key: "projectsGoals", label: "نسبة المشاريع التي حققت أهدافها" },
    ],
  },
  {
    key: "hr",
    name: "الموارد البشرية",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    badgeColor: "bg-purple-100 text-purple-700",
    indicators: [
      { key: "employeeTurnover", label: "معدل دوران الموظفين" },
      { key: "employeeSatisfaction", label: "متوسط رضا الموظفين" },
      { key: "trainingCompletion", label: "نسبة إكمال خطط التدريب السنوية" },
      { key: "performanceEvaluation", label: "نسبة الالتزام بتقييم الأداء السنوي" },
    ],
  },
  {
    key: "volunteers",
    name: "المتطوعين",
    icon: Heart,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    badgeColor: "bg-rose-100 text-rose-700",
    indicators: [
      { key: "volunteerSatisfaction", label: "متوسط رضا المتطوعين" },
      { key: "organizedVolunteering", label: "نسبة التطوع المنظم (عبر برامج واضحة)" },
    ],
  },
  {
    key: "governance",
    name: "الحوكمة",
    icon: Shield,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    badgeColor: "bg-amber-100 text-amber-700",
    indicators: [
      { key: "approvedPolicies", label: "نسبة السياسات واللوائح المعتمدة من المطلوبة" },
      { key: "boardMeetings", label: "انتظام اجتماعات مجلس الإدارة" },
      { key: "boardDecisions", label: "نسبة تنفيذ قرارات المجلس" },
      { key: "govRequirements", label: "مستوى الالتزام بمتطلبات الحوكمة الحكومية" },
    ],
  },
  {
    key: "tech",
    name: "التقنية",
    icon: Zap,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    badgeColor: "bg-cyan-100 text-cyan-700",
    indicators: [
      { key: "automatedProcesses", label: "نسبة العمليات المؤتمتة من إجمالي العمليات" },
      { key: "techSatisfaction", label: "رضا المستخدمين عن الأنظمة التقنية" },
      { key: "digitalChannels", label: "نسبة اعتماد القنوات الرقمية في تقديم الخدمات" },
    ],
  },
  {
    key: "marketing",
    name: "التسويق والاتصال",
    icon: Globe,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    badgeColor: "bg-indigo-100 text-indigo-700",
    indicators: [
      { key: "audienceGrowth", label: "نسبة نمو المتابعين/الجمهور" },
      { key: "campaigns", label: "عدد الحملات التسويقية المنفذة" },
      { key: "stakeholderComm", label: "مستوى رضا أصحاب المصلحة عن الاتصال المؤسسي" },
    ],
  },
  {
    key: "impact",
    name: "الأثر",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    badgeColor: "bg-orange-100 text-orange-700",
    indicators: [
      { key: "measuredImpact", label: "نسبة البرامج ذات الأثر المقاس" },
      { key: "nationalAlignment", label: "مدى توافق البرامج مع الأولويات الوطنية/المجتمعية" },
    ],
  },
];

// ─── Six Pillars Definition ───────────────────────────────────────────────────
type PillarDef = {
  key: string;
  name: string;
  desc: string;
  icon: any;
  gradient: string;
  iconBg: string;
  indicatorKeys: string[];
  indicatorLabels: string[];
};

const sixPillars: PillarDef[] = [
  {
    key: "purpose",
    name: "الغاية والأثر المجتمعي",
    desc: "وضوح الغرض المجتمعي للمنظمة وتحديد الأهداف التي تترجم إلى أثر ملموس في المجتمع.",
    icon: Target,
    gradient: "from-orange-500 to-amber-500",
    iconBg: "bg-orange-100 text-orange-600",
    indicatorKeys: ["measuredImpact", "nationalAlignment", "programExpenses", "projectsGoals"],
    indicatorLabels: ["الأثر المقاس", "التوافق الوطني", "المصاريف على البرامج", "تحقيق الأهداف"],
  },
  {
    key: "integrity",
    name: "النزاهة المجتمعية والحوكمة",
    desc: "الشفافية والمساءلة في الحوكمة من الأسس التي تُسهم في نجاح التحول المجتمعي.",
    icon: Shield,
    gradient: "from-amber-500 to-yellow-400",
    iconBg: "bg-amber-100 text-amber-600",
    indicatorKeys: ["approvedPolicies", "boardMeetings", "boardDecisions", "govRequirements", "sustainableRevenue"],
    indicatorLabels: ["السياسات المعتمدة", "انتظام الاجتماعات", "تنفيذ قرارات المجلس", "متطلبات الحوكمة", "الإيرادات المستدامة"],
  },
  {
    key: "empowerment",
    name: "التمكين والمشاركة الاجتماعية",
    desc: "تمكين الأفراد والمجتمعات في اتخاذ القرارات يُعتبر جوهرًا للتحول المجتمعي المستدام.",
    icon: Users,
    gradient: "from-rose-500 to-pink-500",
    iconBg: "bg-rose-100 text-rose-600",
    indicatorKeys: ["volunteerSatisfaction", "organizedVolunteering", "employeeSatisfaction", "stakeholderComm"],
    indicatorLabels: ["رضا المتطوعين", "التطوع المنظم", "رضا الموظفين", "الاتصال المؤسسي"],
  },
  {
    key: "innovation",
    name: "التجديد والتكيّف المجتمعي",
    desc: "الابتكار الاجتماعي والتكيف مع التغيرات في البيئة الاجتماعية مع تقديم حلول مجتمعية جديدة.",
    icon: Lightbulb,
    gradient: "from-cyan-500 to-blue-500",
    iconBg: "bg-cyan-100 text-cyan-600",
    indicatorKeys: ["automatedProcesses", "techSatisfaction", "digitalChannels", "audienceGrowth"],
    indicatorLabels: ["العمليات المؤتمتة", "رضا التقنية", "القنوات الرقمية", "نمو الجمهور"],
  },
  {
    key: "efficiency",
    name: "الكفاءة التشغيلية",
    desc: "القدرة على إدارة الموارد والعمليات بفعالية لضمان تنفيذ الأهداف المجتمعية بكفاءة.",
    icon: Activity,
    gradient: "from-blue-500 to-indigo-500",
    iconBg: "bg-blue-100 text-blue-600",
    indicatorKeys: ["operationalPlan", "budgetDeviation", "adminExpenses", "trainingCompletion", "performanceEvaluation"],
    indicatorLabels: ["الخطة التشغيلية", "الانحراف عن الميزانية", "المصاريف الإدارية", "خطط التدريب", "تقييم الأداء"],
  },
  {
    key: "partnerships",
    name: "الشراكات والنظم البيئية",
    desc: "بناء شراكات استراتيجية يضمن تحقيق الأثر المستدام بما يتجاوز حدود المنظمة.",
    icon: Handshake,
    gradient: "from-purple-500 to-violet-500",
    iconBg: "bg-purple-100 text-purple-600",
    indicatorKeys: ["campaigns", "employeeTurnover", "revenueGrowth"],
    indicatorLabels: ["الحملات التسويقية", "استقرار الكوادر", "نمو الإيرادات"],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const buildInitialData = (): PerformanceData => {
  const data: PerformanceData = {};
  categories.forEach((cat) =>
    cat.indicators.forEach((ind) => {
      data[ind.key] = "";
    })
  );
  return data;
};

const getScore = (data: PerformanceData, key: string) =>
  Math.min(100, Math.max(0, parseFloat(data[key]) || 0));

const getCategoryScore = (data: PerformanceData, cat: (typeof categories)[0]) => {
  const scores = cat.indicators.map((ind) => getScore(data, ind.key));
  const filled = scores.filter((_, i) => data[cat.indicators[i].key].trim() !== "");
  if (filled.length === 0) return null;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
};

const getPillarScore = (data: PerformanceData, pillar: PillarDef): number | null => {
  const filled = pillar.indicatorKeys.filter((k) => data[k]?.trim() !== "");
  if (filled.length === 0) return null;
  const total = pillar.indicatorKeys.reduce((sum, k) => sum + getScore(data, k), 0);
  return total / pillar.indicatorKeys.length;
};

const getOverallScore = (data: PerformanceData) => {
  const scores = categories
    .map((cat) => getCategoryScore(data, cat))
    .filter((s) => s !== null) as number[];
  if (scores.length === 0) return null;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
};

const getPillarOverallScore = (data: PerformanceData): number | null => {
  const scores = sixPillars
    .map((p) => getPillarScore(data, p))
    .filter((s) => s !== null) as number[];
  if (scores.length === 0) return null;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
};

const getScoreLevel = (score: number | null) => {
  if (score === null) return null;
  if (score >= 85)
    return {
      label: "جيد",
      color: "text-green-700",
      bg: "bg-green-100",
      border: "border-green-300",
      icon: CheckCircle2,
      barColor: "bg-green-500",
      dot: "bg-green-500",
    };
  if (score >= 70)
    return {
      label: "يحتاج تطوير",
      color: "text-amber-700",
      bg: "bg-amber-100",
      border: "border-amber-300",
      icon: AlertCircle,
      barColor: "bg-amber-500",
      dot: "bg-amber-400",
    };
  return {
    label: "يحتاج تطوير عاجل",
    color: "text-red-700",
    bg: "bg-red-100",
    border: "border-red-300",
    icon: XCircle,
    barColor: "bg-red-500",
    dot: "bg-red-500",
  };
};

// Pillar-specific level thresholds (different scale from categories)
const getPillarLevel = (score: number | null) => {
  if (score === null) return null;
  if (score >= 70)
    return {
      label: "مستوى جيد",
      color: "text-green-700",
      bg: "bg-green-100",
      border: "border-green-200",
      barColor: "bg-green-500",
      ringColor: "ring-green-400",
      icon: CheckCircle2,
    };
  if (score >= 40)
    return {
      label: "مستوى متوسط",
      color: "text-amber-700",
      bg: "bg-amber-100",
      border: "border-amber-200",
      barColor: "bg-amber-400",
      ringColor: "ring-amber-400",
      icon: AlertCircle,
    };
  return {
    label: "يحتاج تدخلاً عاجلاً",
    color: "text-red-700",
    bg: "bg-red-100",
    border: "border-red-200",
    barColor: "bg-red-500",
    ringColor: "ring-red-400",
    icon: XCircle,
  };
};

function PillarGauge({ score }: { score: number | null }) {
  const pct = score !== null ? Math.min(100, Math.max(0, score)) : 0;
  const level = getPillarLevel(pct);
  const color = pct >= 70 ? "#22c55e" : pct >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative w-20 h-20 mx-auto">
      <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="3"
        />
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${pct}, 100`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-black text-brand-dark">
          {score !== null ? `${pct.toFixed(0)}%` : "—"}
        </span>
      </div>
    </div>
  );
}

function BigGauge({ score, label }: { score: number | null; label: string }) {
  const pct = score !== null ? Math.min(100, Math.max(0, score)) : 0;
  const color = pct >= 70 ? "#22c55e" : pct >= 40 ? "#f59e0b" : "#ef4444";
  const levelLabel = getPillarLevel(pct)?.label ?? "—";
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36 mb-4">
        <svg viewBox="0 0 36 36" className="w-36 h-36 -rotate-90">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2.5"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeDasharray={`${pct}, 100`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-brand-dark leading-none">
            {score !== null ? pct.toFixed(0) : "—"}
          </span>
          <span className="text-xs text-brand-gray font-bold">/ 100</span>
        </div>
      </div>
      <p className="text-sm font-bold text-brand-gray">{label}</p>
      <span
        className="mt-1 text-xs font-black px-3 py-1 rounded-full"
        style={{ backgroundColor: color + "20", color }}
      >
        {levelLabel}
      </span>
    </div>
  );
}

export default function GovernancePage() {
  const [data, setData] = useState<PerformanceData>(buildInitialData());
  const [activeTab, setActiveTab] = useState<"form" | "results">("form");
  const [orgName, setOrgName] = useState("");

  const setField = (key: string, value: string) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const overallScore = getOverallScore(data);
  const overallLevel = getScoreLevel(overallScore);

  // Pillar computations
  const pillarScores = sixPillars.map((p) => ({
    ...p,
    score: getPillarScore(data, p),
  }));
  const pillarOverall = getPillarOverallScore(data);
  const sortedPillars = [...pillarScores]
    .filter((p) => p.score !== null)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const topPillar = sortedPillars[0] ?? null;
  const secondPillar = sortedPillars[1] ?? null;
  const worstPillar = [...pillarScores]
    .filter((p) => p.score !== null)
    .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))[0] ?? null;

  const aiRecommendation = () => {
    if (!topPillar) return "أدخل بيانات المؤشرات للحصول على تحليل الأركان.";
    const topPct = (topPillar.score ?? 0).toFixed(0);
    const worstName = worstPillar?.name ?? "";
    return `منظمتك تُبدع في ركن ${topPillar.name} بمستوى ${topPct}%، وهذا يعكس قوة حوكمتها وشفافيتها. ننصح بالتركيز على تطوير ركن ${worstName} لتحقيق تكامل أركان التحول المجتمعي المستدام.`;
  };

  return (
    <div className="w-full min-h-screen flex flex-col font-almarai bg-[#F5F5F7]" dir="rtl">
      <Navbar />

      <section className="pt-36 pb-10 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 blur-[100px] -ml-40 -mt-40 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <Link
            href="/ecstt"
            className="inline-flex items-center gap-2 text-white/40 hover:text-brand-gold mb-8 text-sm font-bold transition-colors"
          >
            <ArrowRight className="w-4 h-4" /> المنظومة الاجتماعية
          </Link>
          <div className="flex items-start gap-5 mb-6">
            <div className="bg-amber-500 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="bg-amber-500/20 text-amber-300 px-4 py-1 rounded-full text-xs font-black mb-3 inline-block">
                الأداء المؤسسي
              </span>
              <h1 className="text-3xl md:text-5xl font-black leading-tight">
                قياس الأداء المؤسسي
              </h1>
              <p className="text-white/60 mt-3 text-base max-w-2xl">
                نموذج متكامل لقياس أداء المؤسسة عبر ثمانية محاور رئيسية وفق معايير الأداء المؤسسي
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            {[
              { id: "form", label: "📝 إدخال مؤشرات الأداء" },
              { id: "results", label: "📊 لوحة النتائج" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-black text-sm transition-all ${activeTab === tab.id ? "bg-amber-500 text-white shadow-lg" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-10 flex-1">

        {/* ── Form ────────────────────────────────────────────────────────── */}
        {activeTab === "form" && (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-md p-8">
              <h2 className="text-xl font-black text-brand-dark mb-5 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-500" /> معلومات المؤسسة
              </h2>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="اسم المؤسسة / الجمعية"
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-amber-400 focus:outline-none text-brand-dark text-sm"
              />
            </div>

            <div className="bg-white rounded-3xl shadow-md p-6 mb-4">
              <h3 className="text-sm font-black text-brand-gray mb-3">مقياس التصنيف</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-green-500 inline-block shrink-0" />
                  <span className="w-4 h-4 rounded-full bg-amber-400 inline-block shrink-0" />
                  <span className="w-4 h-4 rounded-full bg-red-500 inline-block shrink-0" />
                </div>
              </div>
            </div>

            {categories.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <div key={cat.key} className={`bg-white rounded-3xl shadow-md p-8 border-r-4 ${cat.borderColor}`}>
                  <h2 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-2">
                    <CatIcon className={`w-5 h-5 ${cat.color}`} /> {cat.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cat.indicators.map((ind) => (
                      <div key={ind.key}>
                        <label className="block text-xs font-black text-brand-dark mb-2">
                          {ind.label} (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={data[ind.key]}
                          onChange={(e) => setField(ind.key, e.target.value)}
                          placeholder="0 - 100"
                          className={`w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:${cat.borderColor} focus:outline-none text-brand-dark text-sm`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <Button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-5 h-5" /> عرض نتائج الأداء المؤسسي
            </Button>
          </form>
        )}

        {/* ── Results ─────────────────────────────────────────────────────── */}
        {activeTab === "results" && (
          <div className="max-w-5xl mx-auto space-y-6">

            {/* Header */}
            <div className="bg-brand-dark rounded-3xl p-8 text-white flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-white/50 text-sm font-bold mb-1">تقرير قياس الأداء المؤسسي</p>
                <h2 className="text-3xl font-black">{orgName || "المؤسسة"}</h2>
              </div>
              <div className="flex items-center gap-4">
                {overallScore !== null && overallLevel && (
                  <div className={`px-6 py-3 rounded-2xl font-black text-lg border ${overallLevel.border} ${overallLevel.bg} ${overallLevel.color}`}>
                    الدرجة الإجمالية: {overallScore.toFixed(1)}% — {overallLevel.label}
                  </div>
                )}
                <Button
                  onClick={() => setActiveTab("form")}
                  className="bg-white text-brand-dark hover:bg-white/90 rounded-xl font-black text-sm px-4 py-3"
                >
                  تعديل البيانات
                </Button>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const CatIcon = cat.icon;
                const catScore = getCategoryScore(data, cat);
                const level = getScoreLevel(catScore);
                return (
                  <div key={cat.key} className={`bg-white rounded-3xl shadow-md p-6 border-r-4 ${cat.borderColor}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.bgColor}`}>
                          <CatIcon className={`w-5 h-5 ${cat.color}`} />
                        </div>
                        <h3 className="font-black text-brand-dark">{cat.name}</h3>
                      </div>
                      {catScore !== null && level ? (
                        <span className={`text-xs font-black px-3 py-1 rounded-full ${level.bg} ${level.color}`}>
                          {catScore.toFixed(1)}% — {level.label}
                        </span>
                      ) : (
                        <span className="text-xs font-black px-3 py-1 rounded-full bg-gray-100 text-gray-500">
                          لم تُدخل بيانات
                        </span>
                      )}
                    </div>

                    {catScore !== null && (
                      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-700 ${level?.barColor || "bg-gray-400"}`}
                          style={{ width: `${Math.min(100, catScore)}%` }}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      {cat.indicators.map((ind) => {
                        const val = data[ind.key].trim();
                        const score = val ? getScore(data, ind.key) : null;
                        const indLevel = getScoreLevel(score);
                        return (
                          <div key={ind.key} className="flex items-center justify-between text-xs">
                            <span className="text-brand-gray font-medium truncate max-w-[70%]">{ind.label}</span>
                            {score !== null && indLevel ? (
                              <span className={`font-black ${indLevel.color}`}>{score.toFixed(0)}%</span>
                            ) : (
                              <span className="text-gray-300 font-bold">—</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall summary */}
            {overallScore !== null && overallLevel && (
              <div className="bg-white rounded-3xl shadow-md p-8">
                <h3 className="font-black text-brand-dark text-xl mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-500" /> ملخص الأداء العام
                </h3>
                <div className="space-y-4">
                  {categories.map((cat) => {
                    const catScore = getCategoryScore(data, cat);
                    const level = getScoreLevel(catScore);
                    const CatIcon = cat.icon;
                    return (
                      <div key={cat.key}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                            <CatIcon className={`w-4 h-4 ${cat.color}`} />
                            {cat.name}
                          </div>
                          <div className="flex items-center gap-2">
                            {catScore !== null && level ? (
                              <>
                                <span className={`text-xs font-black ${level.color}`}>{catScore.toFixed(1)}%</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${level.bg} ${level.color}`}>{level.label}</span>
                              </>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-700 ${level?.barColor || "bg-gray-200"}`}
                            style={{ width: catScore !== null ? `${Math.min(100, catScore)}%` : "0%" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className={`mt-6 p-5 rounded-2xl border ${overallLevel.border} ${overallLevel.bg} flex items-center gap-3`}>
                  <overallLevel.icon className={`w-6 h-6 ${overallLevel.color} shrink-0`} />
                  <div>
                    <p className={`font-black text-lg ${overallLevel.color}`}>
                      الدرجة العامة للمؤسسة: {overallScore.toFixed(2)}%
                    </p>
                    <p className={`text-sm font-bold ${overallLevel.color}/80`}>
                      التصنيف: {overallLevel.label}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════
                SIX PILLARS SECTION
                ════════════════════════════════════════════════════════════ */}
            <div className="bg-brand-dark rounded-3xl p-8 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-6 h-6 text-amber-400" />
                <h3 className="font-black text-2xl">تكامل الأركان الستة لتحقيق التحول المجتمعي المستدام</h3>
              </div>
              <p className="text-white/50 text-sm">
                بناءً على مؤشرات بياناتك، تم تحليل موقعك في كل ركن من أركان المنظومة المجتمعية وتحديد أكثر الأركان تعبيراً عن أدائك الحالي.
              </p>
            </div>

            {/* Overall pillar gauge + top pillar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gauge */}
              <div className="bg-white rounded-3xl shadow-md p-8 flex flex-col items-center justify-center">
                <p className="text-brand-gray text-sm font-bold mb-6">المؤشر الكلي للأركان</p>
                <BigGauge
                  score={pillarOverall}
                  label={getPillarLevel(pillarOverall)?.label ?? "لا بيانات"}
                />
              </div>

              {/* Top pillar highlight */}
              {topPillar && (
                <div className={`bg-gradient-to-br ${topPillar.gradient} rounded-3xl shadow-md p-8 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-10 -mt-10" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-5 h-5 text-white" />
                      <span className="text-white/80 text-xs font-black uppercase tracking-wider">الركن الأبرز</span>
                    </div>
                    <div className="text-4xl font-black mb-1">
                      {(topPillar.score ?? 0).toFixed(0)}%
                    </div>
                    <h4 className="font-black text-xl mb-3">{topPillar.name}</h4>
                    <p className="text-white/75 text-sm leading-relaxed mb-5">{topPillar.desc}</p>
                    <div className="border-t border-white/20 pt-4">
                      <p className="text-white/60 text-xs font-bold mb-2">المؤشرات المعبّرة عن هذا الركن:</p>
                      <div className="flex flex-wrap gap-2">
                        {topPillar.indicatorLabels.map((lbl) => (
                          <span key={lbl} className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-lg">
                            {lbl}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* All six pillar cards */}
            <div className="space-y-4">
              {pillarScores.map((pillar, idx) => {
                const level = getPillarLevel(pillar.score);
                const PillarIcon = pillar.icon;
                const pct = pillar.score !== null ? Math.min(100, Math.max(0, pillar.score)) : 0;
                const isTop = topPillar?.key === pillar.key;
                return (
                  <div
                    key={pillar.key}
                    className={`bg-white rounded-3xl shadow-md p-6 border-r-4 ${isTop ? "border-amber-400 ring-1 ring-amber-200" : level ? "border-" + (level.barColor === "bg-green-500" ? "green-200" : level.barColor === "bg-amber-400" ? "amber-200" : "red-200") : "border-gray-100"}`}
                  >
                    <div className="flex items-start gap-5">
                      {/* Gauge */}
                      <div className="shrink-0">
                        <PillarGauge score={pillar.score} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${pillar.iconBg}`}>
                              <PillarIcon className="w-4 h-4" />
                            </div>
                            <h4 className="font-black text-brand-dark text-base">
                              {pillar.name}
                              {isTop && (
                                <span className="mr-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-black">
                                  الأبرز
                                </span>
                              )}
                            </h4>
                          </div>
                          {level && pillar.score !== null ? (
                            <span className={`text-xs font-black px-3 py-1 rounded-full ${level.bg} ${level.color}`}>
                              {level.label}
                            </span>
                          ) : (
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-400">
                              لم تُدخل بيانات
                            </span>
                          )}
                        </div>

                        <p className="text-brand-gray text-xs leading-relaxed mb-3">{pillar.desc}</p>

                        {/* Progress bar */}
                        {pillar.score !== null && (
                          <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                            <div
                              className={`h-2 rounded-full transition-all duration-700 ${level?.barColor || "bg-gray-300"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        )}

                        {/* Indicator tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {pillar.indicatorLabels.map((lbl, i) => {
                            const key = pillar.indicatorKeys[i];
                            const val = data[key]?.trim();
                            const sc = val ? getScore(data, key) : null;
                            const indLvl = getPillarLevel(sc);
                            return (
                              <span
                                key={lbl}
                                className={`text-xs font-bold px-2 py-1 rounded-lg border ${indLvl ? `${indLvl.bg} ${indLvl.color} ${indLvl.border}` : "bg-gray-50 text-gray-400 border-gray-100"}`}
                              >
                                {lbl}
                                {sc !== null && (
                                  <span className="mr-1 opacity-70">({sc.toFixed(0)}%)</span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pillar summary */}
            {sortedPillars.length > 0 && (
              <div className="bg-white rounded-3xl shadow-md p-8">
                <h3 className="font-black text-brand-dark text-xl mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-500" /> ملخص تحليل الأركان
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {topPillar && (
                    <div className="bg-green-50 rounded-2xl p-5 border border-green-100 text-center">
                      <p className="text-green-700 text-xs font-black mb-2">الركن الأبرز</p>
                      <p className="font-black text-brand-dark text-sm mb-2">{topPillar.name}</p>
                      <p className="text-2xl font-black text-green-600">{(topPillar.score ?? 0).toFixed(0)}%</p>
                    </div>
                  )}
                  {secondPillar && (
                    <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 text-center">
                      <p className="text-amber-700 text-xs font-black mb-2">الركن الثاني</p>
                      <p className="font-black text-brand-dark text-sm mb-2">{secondPillar.name}</p>
                      <p className="text-2xl font-black text-amber-600">{(secondPillar.score ?? 0).toFixed(0)}%</p>
                    </div>
                  )}
                  {worstPillar && (
                    <div className="bg-red-50 rounded-2xl p-5 border border-red-100 text-center">
                      <p className="text-red-700 text-xs font-black mb-2">يحتاج أولوية</p>
                      <p className="font-black text-brand-dark text-sm mb-2">{worstPillar.name}</p>
                      <p className="text-2xl font-black text-red-600">{(worstPillar.score ?? 0).toFixed(0)}%</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Recommendation */}
            {topPillar && (
              <div className="bg-gradient-to-l from-amber-600 to-amber-800 rounded-3xl p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-6 h-6 text-amber-200" />
                  <h3 className="font-black text-xl">توصية المنظومة</h3>
                </div>
                <p className="text-white/90 text-base leading-relaxed font-medium">
                  💡 {aiRecommendation()}
                </p>
              </div>
            )}

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
