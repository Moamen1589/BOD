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

const getCategoryScore = (
  data: PerformanceData,
  cat: (typeof categories)[0]
) => {
  const scores = cat.indicators.map((ind) => getScore(data, ind.key));
  const filled = scores.filter((_, i) => data[cat.indicators[i].key].trim() !== "");
  if (filled.length === 0) return null;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
};

const getOverallScore = (data: PerformanceData) => {
  const scores = categories
    .map((cat) => getCategoryScore(data, cat))
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
    };
  if (score >= 70)
    return {
      label: "يحتاج تطوير",
      color: "text-amber-700",
      bg: "bg-amber-100",
      border: "border-amber-300",
      icon: AlertCircle,
      barColor: "bg-amber-500",
    };
  return {
    label: "يحتاج تطوير عاجل",
    color: "text-red-700",
    bg: "bg-red-100",
    border: "border-red-300",
    icon: XCircle,
    barColor: "bg-red-500",
  };
};

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
              <div className="flex flex-wrap gap-4 text-xs font-bold">
                <span className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" /> الحد الأخضر: 85% فأعلى
                </span>
                <span className="flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5" /> الحد الأصفر: 70% إلى أقل من 85%
                </span>
                <span className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1.5 rounded-lg">
                  <XCircle className="w-3.5 h-3.5" /> الحد الأحمر: أقل من 70%
                </span>
              </div>
            </div>

            {categories.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <div key={cat.key} className={`bg-white rounded-3xl shadow-md p-8 border-r-4 ${cat.borderColor}`}>
                  <h2 className={`text-xl font-black text-brand-dark mb-6 flex items-center gap-2`}>
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

        {activeTab === "results" && (
          <div className="max-w-5xl mx-auto space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const CatIcon = cat.icon;
                const catScore = getCategoryScore(data, cat);
                const level = getScoreLevel(catScore);
                const LevelIcon = level?.icon || AlertCircle;
                return (
                  <div
                    key={cat.key}
                    className={`bg-white rounded-3xl shadow-md p-6 border-r-4 ${cat.borderColor}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.bgColor}`}>
                          <CatIcon className={`w-5 h-5 ${cat.color}`} />
                        </div>
                        <h3 className="font-black text-brand-dark">{cat.name}</h3>
                      </div>
                      {catScore !== null && level && (
                        <span className={`text-xs font-black px-3 py-1 rounded-full ${level.bg} ${level.color}`}>
                          {catScore.toFixed(1)}% — {level.label}
                        </span>
                      )}
                      {catScore === null && (
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
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
