import { Target, ShieldCheck, Users, RefreshCw, Zap, Network } from "lucide-react";

export type PillarScore = {
  id: string;
  title: string;
  description: string;
  color: string;
  textColor: string;
  borderColor: string;
  bgLight: string;
  icon: any;
  score: number;
  indicators: string[];
};

const PILLARS_BASE = [
  {
    id: "purpose",
    title: "الغاية والأثر المجتمعي",
    description: "وضوح الغرض المجتمعي للمنظمة وتحديد الأهداف التي تترجم إلى أثر ملموس في المجتمع.",
    color: "bg-purple-500",
    textColor: "text-purple-600",
    borderColor: "border-purple-500",
    bgLight: "bg-purple-50",
    icon: Target,
  },
  {
    id: "integrity",
    title: "النزاهة المجتمعية والحوكمة",
    description: "الشفافية والمساءلة في الحوكمة من الأسس التي تُسهم في نجاح التحول المجتمعي.",
    color: "bg-blue-500",
    textColor: "text-blue-600",
    borderColor: "border-blue-500",
    bgLight: "bg-blue-50",
    icon: ShieldCheck,
  },
  {
    id: "empowerment",
    title: "التمكين والمشاركة الاجتماعية",
    description: "تمكين الأفراد والمجتمعات في اتخاذ القرارات يُعتبر جوهرًا للتحول المجتمعي المستدام.",
    color: "bg-green-500",
    textColor: "text-green-600",
    borderColor: "border-green-500",
    bgLight: "bg-green-50",
    icon: Users,
  },
  {
    id: "innovation",
    title: "التجديد والتكيّف المجتمعي",
    description: "الابتكار الاجتماعي والتكيف مع التغيرات في البيئة الاجتماعية مع تقديم حلول مجتمعية جديدة.",
    color: "bg-orange-500",
    textColor: "text-orange-600",
    borderColor: "border-orange-500",
    bgLight: "bg-orange-50",
    icon: RefreshCw,
  },
  {
    id: "capacity",
    title: "الكفاءة التشغيلية",
    description: "القدرة على إدارة الموارد والعمليات بفعالية لضمان تنفيذ الأهداف المجتمعية بكفاءة.",
    color: "bg-red-500",
    textColor: "text-red-600",
    borderColor: "border-red-500",
    bgLight: "bg-red-50",
    icon: Zap,
  },
  {
    id: "sustainability",
    title: "الشراكات والنظم البيئية",
    description: "بناء شراكات استراتيجية يضمن تحقيق الأثر المستدام بما يتجاوز حدود المنظمة.",
    color: "bg-amber-500",
    textColor: "text-amber-600",
    borderColor: "border-amber-500",
    bgLight: "bg-amber-50",
    icon: Network,
  },
];

type Props = {
  scores: Record<string, number>;
  indicators: Record<string, string[]>;
  systemName?: string;
};

function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "مستوى ممتاز", color: "text-green-600" };
  if (score >= 60) return { label: "مستوى جيد", color: "text-blue-600" };
  if (score >= 40) return { label: "مستوى متوسط", color: "text-amber-600" };
  if (score >= 20) return { label: "مستوى ضعيف", color: "text-orange-600" };
  return { label: "يحتاج تدخلاً عاجلاً", color: "text-red-600" };
}

function getBarColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-blue-500";
  if (score >= 40) return "bg-amber-500";
  if (score >= 20) return "bg-orange-500";
  return "bg-red-500";
}

export function PillarsAnalysis({ scores, indicators, systemName }: Props) {
  const pillarsWithScores = PILLARS_BASE.map(p => ({
    ...p,
    score: Math.min(100, Math.max(0, Math.round(scores[p.id] || 0))),
    pillarsIndicators: indicators[p.id] || [],
  }));

  const sorted = [...pillarsWithScores].sort((a, b) => b.score - a.score);
  const primary = sorted[0];
  const secondary = sorted[1];
  const weakest = sorted[sorted.length - 1];
  const overallAvg = Math.round(pillarsWithScores.reduce((s, p) => s + p.score, 0) / pillarsWithScores.length);

  const overallLabel = getScoreLabel(overallAvg);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-brand-dark rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-brand-gold/10 rounded-full -ml-32 -mt-32 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-brand-gold/20 text-brand-gold px-4 py-1.5 rounded-full text-xs font-black">تحليل الأركان الستة</span>
            {systemName && <span className="bg-white/10 text-white/60 px-3 py-1.5 rounded-full text-xs font-bold">{systemName}</span>}
          </div>
          <h3 className="text-2xl font-black mb-2">تكامل الأركان الستة لتحقيق التحول المجتمعي المستدام</h3>
          <p className="text-white/50 text-sm max-w-2xl">
            بناءً على مؤشرات بياناتك، تم تحليل موقعك في كل ركن من أركان المنظومة المجتمعية وتحديد أكثر الأركان تعبيراً عن أدائك الحالي.
          </p>

          {/* Overall Score */}
          <div className="mt-6 flex items-center gap-6 flex-wrap">
            <div>
              <p className="text-white/40 text-xs font-bold mb-1">المؤشر الكلي للأركان</p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-white">{overallAvg}</span>
                <span className="text-white/50 text-lg mb-1">/ 100</span>
              </div>
              <span className={`text-xs font-black ${overallLabel.color.replace("text-", "text-")}`}
                style={{ color: overallAvg >= 80 ? "#4ade80" : overallAvg >= 60 ? "#60a5fa" : overallAvg >= 40 ? "#fbbf24" : "#f87171" }}>
                {overallLabel.label}
              </span>
            </div>
            <div className="flex-1 min-w-48">
              <div className="w-full bg-white/10 rounded-full h-3">
                <div className={`h-3 rounded-full transition-all duration-700 ${getBarColor(overallAvg)}`}
                  style={{ width: `${overallAvg}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Pillar Spotlight */}
      <div className={`${primary.bgLight} ${primary.borderColor} border-2 rounded-3xl p-7 relative overflow-hidden`}>
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full opacity-10 -ml-10 -mt-10 pointer-events-none" style={{ backgroundColor: primary.color.replace("bg-", "").replace("-500", "") }} />
        <div className="relative z-10">
          <div className="flex items-start gap-4">
            <div className={`${primary.color} w-14 h-14 rounded-2xl flex items-center justify-center shrink-0`}>
              <primary.icon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`${primary.color} text-white text-xs font-black px-3 py-1 rounded-full`}>الركن الأبرز</span>
                <span className={`${primary.textColor} text-xs font-black`}>{primary.score}%</span>
              </div>
              <h4 className={`text-xl font-black ${primary.textColor} mb-2`}>{primary.title}</h4>
              <p className="text-brand-gray text-sm leading-relaxed mb-4">{primary.description}</p>
              {primary.pillarsIndicators.length > 0 && (
                <div>
                  <p className="text-brand-dark text-xs font-black mb-2">المؤشرات المعبّرة عن هذا الركن:</p>
                  <div className="flex flex-wrap gap-2">
                    {primary.pillarsIndicators.map((ind, i) => (
                      <span key={i} className={`${primary.bgLight} ${primary.borderColor} border ${primary.textColor} text-xs font-bold px-3 py-1 rounded-full`}>{ind}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* All 6 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pillarsWithScores.map((pillar, idx) => {
          const { label, color: labelColor } = getScoreLabel(pillar.score);
          const isPrimary = pillar.id === primary.id;
          const isWeakest = pillar.id === weakest.id;
          return (
            <div key={pillar.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all ${isPrimary ? `${pillar.borderColor} shadow-md` : isWeakest ? "border-red-100" : "border-gray-100"}`}>
              <div className="flex items-start gap-4 mb-5">
                <div className={`${pillar.color} w-11 h-11 rounded-xl flex items-center justify-center shrink-0`}>
                  <pillar.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-black text-brand-dark text-sm">{pillar.title}</h4>
                    {isPrimary && <span className={`${pillar.color} text-white text-[10px] font-black px-2 py-0.5 rounded-full`}>الأبرز</span>}
                    {isWeakest && !isPrimary && <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full">يحتاج تحسين</span>}
                  </div>
                  <p className="text-brand-gray text-xs leading-relaxed">{pillar.description}</p>
                </div>
              </div>

              {/* Score Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-brand-gray text-xs font-bold">مستوى الأداء</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black ${labelColor}`}>{label}</span>
                    <span className="text-brand-dark font-black text-sm">{pillar.score}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full transition-all duration-700 ${getBarColor(pillar.score)}`}
                    style={{ width: `${pillar.score}%` }} />
                </div>
              </div>

              {/* Indicators */}
              {pillar.pillarsIndicators.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {pillar.pillarsIndicators.map((ind, i) => (
                    <span key={i} className={`${pillar.bgLight} ${pillar.textColor} text-[11px] font-bold px-2.5 py-1 rounded-full`}>{ind}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Insight Summary */}
      <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
        <h4 className="font-black text-brand-dark mb-5">ملخص تحليل الأركان</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`${primary.bgLight} rounded-2xl p-4 text-center`}>
            <div className={`${primary.color} w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <primary.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-brand-gray font-bold mb-1">الركن الأبرز</p>
            <p className={`font-black text-sm ${primary.textColor}`}>{primary.title}</p>
            <p className={`text-2xl font-black ${primary.textColor} mt-1`}>{primary.score}%</p>
          </div>
          <div className={`${secondary.bgLight} rounded-2xl p-4 text-center`}>
            <div className={`${secondary.color} w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <secondary.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-brand-gray font-bold mb-1">الركن الثاني</p>
            <p className={`font-black text-sm ${secondary.textColor}`}>{secondary.title}</p>
            <p className={`text-2xl font-black ${secondary.textColor} mt-1`}>{secondary.score}%</p>
          </div>
          <div className="bg-red-50 rounded-2xl p-4 text-center">
            <div className="bg-red-500 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <weakest.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-brand-gray font-bold mb-1">يحتاج أولوية</p>
            <p className="font-black text-sm text-red-600">{weakest.title}</p>
            <p className="text-2xl font-black text-red-600 mt-1">{weakest.score}%</p>
          </div>
        </div>

        <div className="mt-5 bg-brand-light-gold rounded-2xl p-5">
          <p className="text-brand-dark font-bold text-sm leading-relaxed">
            💡 <span className="font-black">توصية المنظومة: </span>
            منظمتك تُبدع في ركن <span className="text-brand-gold font-black">{primary.title}</span> بمستوى {primary.score}%،
            وهذا يعكس قوة {primary.id === "purpose" ? "رؤيتها وأثرها المباشر على المجتمع" :
              primary.id === "integrity" ? "حوكمتها وشفافيتها المالية" :
              primary.id === "empowerment" ? "مشاركتها المجتمعية وتمكين مستفيديها" :
              primary.id === "innovation" ? "قدرتها على الابتكار والتكيف" :
              primary.id === "capacity" ? "كفاءتها التشغيلية وإدارة مواردها" :
              "شبكة شراكاتها ونظامها البيئي"}.
            {weakest.score < 50 && ` ننصح بالتركيز على تطوير ركن `}
            {weakest.score < 50 && <span className="text-red-600 font-black"> {weakest.title}</span>}
            {weakest.score < 50 && " لتحقيق تكامل أركان التحول المجتمعي المستدام."}
          </p>
        </div>
      </div>
    </div>
  );
}
