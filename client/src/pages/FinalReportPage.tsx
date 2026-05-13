import { useState, useEffect, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Download,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  MessageCircle,
  ChevronLeft,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  fetchFinalReport,
  type FinalReportData,
} from "@/lib/complianceAssessment";

const AXIS_META: Record<
  string,
  {
    primaryProduct: string;
    supportingProduct: string;
    treatmentPath: string;
    mainGap: string;
    expectedOutputs: string[];
  }
> = {
  "الحوكمة والامتثال النظامي": {
    primaryProduct: "مسرعة أثر وريادة",
    supportingProduct: "",
    treatmentPath: "مسار ضبط الحوكمة والامتثال",
    mainGap: "ضعف في تفعيل المجلس واللجان والسياسات وإدارة المخاطر والامتثال",
    expectedOutputs: ["خطة تصحيح حوكمي", "سياسات ولوائح محدثة", "تفعيل اللجان", "سجل مخاطر", "نظام أرشفة للقرارات"],
  },
  "القيادة والاستراتيجية": {
    primaryProduct: "مسرعة أثر وريادة",
    supportingProduct: "",
    treatmentPath: "مسار التأسيس الاستراتيجي",
    mainGap: "ضعف التوجه الاستراتيجي وغياب الربط الفعال بين الرؤية والأهداف والأثر",
    expectedOutputs: ["وثيقة توجه استراتيجي محدثة", "أهداف استراتيجية مرتبطة بالأثر", "نتائج مرجوة قابلة للقياس", "خارطة أولويات مؤسسية"],
  },
  "التخطيط والتشغيل": {
    primaryProduct: "مسرعة أثر وريادة",
    supportingProduct: "منصة أداء",
    treatmentPath: "مسار التخطيط والتشغيل المؤسسي",
    mainGap: "ضعف الخطة التشغيلية وإدارة المهام والتقارير ووضوح الأدوار",
    expectedOutputs: ["خطة تشغيلية سنوية", "توزيع مسؤوليات", "مؤشرات متابعة تشغيلية", "جداول زمنية"],
  },
  "إدارة المشاريع": {
    primaryProduct: "مختبرات حقق",
    supportingProduct: "منصة أداء",
    treatmentPath: "مسار تصميم المبادرات والجاهزية التنفيذية",
    mainGap: "ضعف منهجية إدارة المشاريع واختبار الجاهزية والتقارير المرحلية وإدارة المخاطر",
    expectedOutputs: ["نماذج تصميم مشاريع", "فلتر جاهزية قبل الإطلاق", "ملفات مبادرات قابلة للتمويل", "تقارير مرحلية"],
  },
  "قياس الأداء والأثر": {
    primaryProduct: "منصة أداء",
    supportingProduct: "",
    treatmentPath: "مسار قياس الأداء والأثر",
    mainGap: "ضعف المؤشرات والقياس الدوري وتقارير الأثر واستخدام النتائج في القرار",
    expectedOutputs: ["بطاقة مؤشرات أداء", "آلية قياس دورية", "نماذج تقارير أداء", "لوحة متابعة للإدارة"],
  },
  "الإدارة المالية والاستدامة": {
    primaryProduct: "مسرعة أثر وريادة",
    supportingProduct: "منصة أداء",
    treatmentPath: "مسار الاستدامة المالية وتنمية الموارد",
    mainGap: "ضعف الشفافية وتنويع مصادر الدخل والتقارير المالية والجاهزية التمويلية",
    expectedOutputs: ["خطة تنمية موارد", "مستهدفات مالية ربع سنوية", "موازنة مرتبطة بالبرامج", "آلية متابعة مالية"],
  },
  "الموارد البشرية وبناء القدرات": {
    primaryProduct: "أكاديمية حقق",
    supportingProduct: "",
    treatmentPath: "مسار بناء القدرات المؤسسية",
    mainGap: "ضعف الهيكل التنظيمي والتوصيف الوظيفي وتقييم الأداء وخطط التدريب",
    expectedOutputs: ["خطة بناء قدرات", "برنامج تأهيل للفريق", "تدريب مجلس الإدارة", "رفع جاهزية تشغيل الأدوات الجديدة"],
  },
  "التقنية والتحول الرقمي": {
    primaryProduct: "أثر 360 وعباق",
    supportingProduct: "منصة أداء",
    treatmentPath: "مسار التحول الرقمي وتوحيد البيانات",
    mainGap: "ضعف في استخدام الأنظمة وتوحيد البيانات والأتمتة ودعم القرار الرقمي",
    expectedOutputs: ["قاعدة بيانات موحدة", "أرشفة منظمة", "لوحات متابعة رقمية", "أتمتة أولية للعمليات المتكررة"],
  },
  "الاتصال المؤسسي والسرد": {
    primaryProduct: "أكاديمية حقق",
    supportingProduct: "منصة أداء",
    treatmentPath: "مسار الاتصال المؤسسي وسرد الأثر",
    mainGap: "ضعف استراتيجية الاتصال وشفافية التواصل والقنوات وتفاعل أصحاب المصلحة",
    expectedOutputs: ["تأهيل الفريق على سرد الأثر", "رسائل مؤسسية واضحة", "تحسين قنوات التواصل", "رفع جودة التواصل مع الداعمين"],
  },
  "الإنسانية وأصحاب المصلحة": {
    primaryProduct: "مسرعة أثر وريادة",
    supportingProduct: "مختبرات حقق",
    treatmentPath: "مسار مواءمة أصحاب المصلحة والأثر",
    mainGap: "ضعف في تمكين المستفيدين وشمولية القرار وعدالة الإجراءات وربط العمل بأثر اجتماعي",
    expectedOutputs: ["مصفوفة أصحاب المصلحة", "آلية جمع صوت المستفيدين", "ربط الاحتياجات بالأهداف", "تحديد مؤشرات أثر اجتماعي"],
  },
};

const TOP_5_PRIORITIES = [
  {
    order: 1,
    intervention: "إعادة بناء التوجه الاستراتيجي",
    relatedAxes: ["القيادة والاستراتيجية", "التخطيط والتشغيل", "الإنسانية وأصحاب المصلحة"],
    primaryProduct: "مسرعة أثر وريادة",
    expectedResult: "تحديد وجهة المنظمة وأولوياتها وربطها بالأثر والخطة التشغيلية",
  },
  {
    order: 2,
    intervention: "تأسيس منظومة قياس الأداء والأثر",
    relatedAxes: ["قياس الأداء والأثر", "التخطيط والتشغيل", "إدارة المشاريع"],
    primaryProduct: "منصة أداء",
    expectedResult: "مؤشرات وتقارير ولوحات متابعة تربط التنفيذ بالنتائج",
  },
  {
    order: 3,
    intervention: "ضبط الحوكمة والامتثال والسياسات",
    relatedAxes: ["الحوكمة والامتثال النظامي", "الإدارة المالية والاستدامة"],
    primaryProduct: "مسرعة أثر وريادة",
    expectedResult: "حوكمة أوضح، سياسات محدثة، لجان مفعّلة، وسجل مخاطر",
  },
  {
    order: 4,
    intervention: "توحيد البيانات وبناء بيئة متابعة رقمية",
    relatedAxes: ["التقنية والتحول الرقمي", "قياس الأداء والأثر"],
    primaryProduct: "أثر 360 وعباق",
    expectedResult: "بيانات منظمة، أرشفة، أتمتة أولية، ولوحات متابعة",
  },
  {
    order: 5,
    intervention: "رفع جاهزية الفريق ومجلس الإدارة",
    relatedAxes: ["الموارد البشرية وبناء القدرات", "الاتصال المؤسسي والسرد"],
    primaryProduct: "أكاديمية حقق",
    expectedResult: "فريق أكثر قدرة على إدارة الخطة والقياس والتواصل المؤسسي",
  },
];

const ROADMAP_90 = [
  {
    phase: "أول 30 يوم",
    label: "التشخيص العميق وترتيب الأولويات",
    actions: [
      "مراجعة نتائج التقييم مع الإدارة ومجلس الإدارة",
      "تحديد الفجوات الحرجة حسب المحاور",
      "إعداد خطة تدخل عاجلة",
      "تفعيل مسار الحوكمة الأساسي",
      "تأسيس قياس الأداء الأولي وتحديد المؤشرات",
    ],
    products: ["مسرعة أثر وريادة", "منصة أداء"],
    expectedOutput: "خطة معالجة تأسيسية وخارطة أولويات واضحة",
    colorClass: "bg-brand-gold",
  },
  {
    phase: "يوم 31 – 60",
    label: "بناء الخطة التشغيلية والتحول الرقمي",
    actions: [
      "إعداد خطة تشغيلية سنوية وتوزيع المسؤوليات",
      "تحديث السياسات الأساسية وتفعيل اللجان",
      "بناء سجل مخاطر",
      "حصر مصادر البيانات وتوحيد نماذج الإدخال",
      "تنظيم الأرشفة وبناء لوحة متابعة أولية",
    ],
    products: ["مسرعة أثر وريادة", "أثر 360 وعباق"],
    expectedOutput: "خطة تشغيلية وحوكمة محدثة + بيئة رقمية أولية للمتابعة",
    colorClass: "bg-brand-dark",
  },
  {
    phase: "يوم 61 – 90",
    label: "تصميم المشاريع وبناء القدرات",
    actions: [
      "اختيار المشاريع ذات الأولوية وتحليل المشكلة",
      "بناء ملفات مبادرات قابلة للتمويل",
      "تدريب الفريق على الخطة والمؤشرات",
      "تأهيل مجلس الإدارة على المتابعة",
      "إصدار أول تقرير متابعة دوري",
    ],
    products: ["مختبرات حقق", "أكاديمية حقق"],
    expectedOutput: "ملفات مشاريع قابلة للتنفيذ + فريق قادر على تشغيل المسارات الجديدة",
    colorClass: "bg-blue-700",
  },
];

const getMaturityLevel = (avg: number) => {
  if (avg >= 4.5) return { label: "تميز مؤسسي", color: "text-green-600", bgColor: "bg-green-600", intervention: "استدامة وابتكار ونقل المعرفة" };
  if (avg >= 3.5) return { label: "نضج متقدم", color: "text-blue-600", bgColor: "bg-blue-600", intervention: "تحسين الأداء والتوسع وتعظيم الأثر" };
  if (avg >= 2.5) return { label: "نضج متوسط", color: "text-yellow-600", bgColor: "bg-yellow-500", intervention: "تطوير وتمكين ورفع الكفاءة" };
  if (avg >= 1.5) return { label: "ضعف مؤسسي", color: "text-orange-600", bgColor: "bg-orange-500", intervention: "ضبط الأساسيات ومعالجة الفجوات" };
  return { label: "خطر مؤسسي", color: "text-red-600", bgColor: "bg-red-500", intervention: "تأسيس عاجل / إعادة بناء / تدخل إنقاذي" };
};

const getAxisTreatmentPath = (axisTitle: string) => {
  for (const [key, meta] of Object.entries(AXIS_META)) {
    if (axisTitle?.includes(key) || key.includes(axisTitle ?? "")) {
      return meta;
    }
  }
  return AXIS_META["القيادة والاستراتيجية"];
};

export default function FinalReportPage() {
  const [, params] = useRoute("/final-report/:submissionId");
  const [, setLocation] = useLocation();
  const [finalReportData, setFinalReportData] = useState<FinalReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const heroRef = useScrollAnimation();

  const submissionId = params?.submissionId;

  useEffect(() => {
    if (!submissionId) {
      setError("معرّف التقديم غير موجود");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadFinalReport = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const reportData = await fetchFinalReport(submissionId);

        if (!isMounted) return;

        setFinalReportData(reportData);
      } catch (err) {
        if (!isMounted) return;

        setError(err instanceof Error ? err.message : "تعذر تحميل التقرير النهائي");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadFinalReport();

    return () => {
      isMounted = false;
    };
  }, [submissionId]);

  const exportToPDF = async () => {
    if (!resultRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");
      const element = resultRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }
      pdf.save(
        `تقرير-التقييم-المؤسسي-${new Date().toLocaleDateString("ar-SA").replace(/\//g, "-")}.pdf`,
      );
    } catch {
      console.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <section className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin mx-auto mb-4" />
            <p className="text-brand-gray font-bold">جارٍ تحميل التقرير...</p>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (error || !finalReportData) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <section className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-black text-brand-dark mb-4">خطأ</h2>
            <p className="text-brand-gray font-bold mb-6">
              {error || "تعذر تحميل التقرير النهائي"}
            </p>
            <Button
              onClick={() => setLocation("/")}
              className="bg-brand-gold hover:bg-brand-gold/90 text-white font-black"
            >
              العودة للصفحة الرئيسية
            </Button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const overallScore = finalReportData.submission?.overall_score ?? 0;
  const maturity = getMaturityLevel(overallScore);
  const orgName = finalReportData.organization?.name || "المنظمة";
  const completionPct = finalReportData.completion?.percentage ?? 0;

  const sortedAxes = [...(finalReportData.axis_breakdown ?? [])].sort(
    (a, b) => (a.axis_score ?? 0) - (b.axis_score ?? 0),
  );

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <Navbar />

      {/* Page Header */}
      <section className="relative py-10 sm:py-14 bg-gradient-to-b from-brand-light/60 to-white overflow-hidden">
        <div ref={heroRef.ref} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 blur-[120px] -mr-40 -mt-40" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Button
              onClick={() => setLocation("/")}
              variant="ghost"
              size="sm"
              className="text-brand-gold hover:text-brand-dark"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة
            </Button>
          </div>
          <h1 className="text-[clamp(2rem,4vw,4rem)] font-black text-brand-dark mb-3 leading-tight">
            التقرير النهائي
          </h1>
          <p className="text-brand-gray font-bold text-lg">نتائج تقييم النضج المؤسسي الشامل</p>
        </div>
      </section>

      {/* Report Content */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">

          {/* Download Button */}
          <div className="flex justify-end mb-8">
            <Button
              onClick={exportToPDF}
              disabled={isExporting}
              className="flex items-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-white font-black rounded-2xl px-6 py-3 text-sm shadow-lg transition-all disabled:opacity-60"
            >
              {isExporting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جارٍ التصدير...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  تصدير التقرير PDF
                </>
              )}
            </Button>
          </div>

          <div ref={resultRef} className="space-y-10">

            {/* 1. بطاقة النتيجة العامة */}
            <div className="bg-brand-dark text-white p-8 sm:p-12 lg:p-16 rounded-[2.5rem] sm:rounded-[3.5rem] text-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
              <div className="relative z-10">
                <h2 className="text-[clamp(1.6rem,2.8vw,3rem)] font-black mb-10">
                  نتيجة تشخيص المنظومة المجتمعية
                </h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-10">
                  <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full border-[14px] border-brand-gold flex flex-col items-center justify-center bg-white text-brand-dark shadow-2xl">
                    <span className="text-4xl sm:text-5xl font-black">
                      {overallScore.toFixed(2)} / 5
                    </span>
                    <span className="text-xs font-black text-brand-gray uppercase tracking-widest mt-1">
                      المتوسط العام
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-bold text-brand-gold mb-3">
                      مستوى النضج المؤسسي:
                    </p>
                    <h3 className={`text-[clamp(2rem,3.2vw,4rem)] font-black ${maturity.color} mb-5 leading-tight drop-shadow-md`}>
                      {finalReportData.submission?.compliance_level || maturity.label}
                    </h3>
                    {finalReportData.submission?.compliance_message && (
                      <p className="text-sm sm:text-base text-white/80 font-bold italic leading-relaxed max-w-md">
                        "{finalReportData.submission.compliance_message}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. اسم الجمعية + نسبة اكتمال التقييم */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-brand-light-gold/40 p-8 rounded-[2rem] border border-brand-gold/20">
                <h3 className="text-xs font-black text-brand-gold uppercase tracking-widest mb-3">
                  المنظمة
                </h3>
                <p className="text-2xl sm:text-3xl font-black text-brand-dark">
                  {orgName}
                </p>
              </div>
              <div className="bg-white border-2 border-brand-gold/20 p-8 rounded-[2rem]">
                <h3 className="text-lg font-black text-brand-dark mb-4">نسبة اكتمال التقييم</h3>
                <div className="flex items-center gap-5">
                  <div>
                    <p className="text-4xl font-black text-brand-gold">
                      {completionPct.toFixed(1)}%
                    </p>
                    <p className="text-xs text-brand-gray font-bold mt-1">
                      {finalReportData.completion?.answered_questions || 0} من{" "}
                      {finalReportData.completion?.total_questions || 0} سؤال
                    </p>
                  </div>
                  <div className="flex-1 h-4 bg-brand-light rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-gold to-amber-500 transition-all duration-500"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. ملخص التشخيص التنفيذي */}
            <div className="bg-white border-2 border-gray-100 rounded-[2rem] p-8 sm:p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-brand-dark text-brand-gold px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                  التشخيص التنفيذي
                </span>
              </div>
              <p className="text-brand-dark font-bold text-base sm:text-lg leading-relaxed mb-6">
                تُظهر نتائج التقييم أن <span className="text-brand-gold font-black">{orgName}</span> حصلت على متوسط عام{" "}
                <span className="font-black">{overallScore.toFixed(2)} / 5</span>، وهو ما يضعها في مستوى{" "}
                <span className={`font-black ${maturity.color}`}>{maturity.label}</span>.
              </p>
              <div className="bg-brand-light-gold/30 border border-brand-gold/20 rounded-2xl p-5">
                <p className="text-sm font-black text-brand-gold mb-2 uppercase tracking-widest">
                  طبيعة التدخل المطلوب
                </p>
                <p className="text-brand-dark font-bold leading-relaxed">
                  {maturity.intervention}
                </p>
              </div>
              {finalReportData.submission?.evaluator_notes && (
                <div className="mt-5 bg-blue-50 border-r-4 border-blue-500 p-5 rounded-l-xl">
                  <p className="text-xs font-black text-blue-700 uppercase tracking-widest mb-2">ملاحظات المقيّم</p>
                  <p className="text-blue-800 font-bold leading-relaxed text-sm">
                    {finalReportData.submission.evaluator_notes}
                  </p>
                </div>
              )}
            </div>

            {/* 4. مسار المعالجة المقترح */}
            <div className="bg-white border-2 border-brand-gold/30 rounded-[2rem] p-8 sm:p-10 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-3 h-full bg-brand-gold/60 rounded-r-full" />
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-brand-light-gold text-brand-gold-dark border border-brand-gold/30 px-4 py-1.5 rounded-full text-xs font-black">
                  ✦ مسار مقترح
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-brand-dark mb-4">
                مسار المعالجة المقترح
              </h3>
              <p className="text-brand-gray font-bold leading-relaxed mb-8">
                بناءً على نتيجة التقييم، تحتاج المنظمة إلى مسار معالجة مؤسسي متكامل يبدأ بإعادة بناء الأساس
                الاستراتيجي والتشغيلي، ثم تفعيل القياس، وتنظيم البيانات، وبناء القدرات.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                <div className="bg-brand-dark rounded-2xl p-5">
                  <p className="text-xs font-black text-brand-gold uppercase tracking-widest mb-2">المسار القائد</p>
                  <p className="text-white font-black text-lg">مسرعة أثر وريادة</p>
                </div>
                <div className="bg-brand-light-gold/40 border border-brand-gold/20 rounded-2xl p-5">
                  <p className="text-xs font-black text-brand-gray uppercase tracking-widest mb-2">المسارات الداعمة</p>
                  <div className="flex flex-wrap gap-2">
                    {["منصة أداء", "مختبرات حقق", "أثر 360 وعباق", "أكاديمية حقق"].map((p) => (
                      <span key={p} className="bg-white border border-brand-gold/30 text-brand-dark text-xs font-black px-3 py-1 rounded-full">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {
                  const el = document.getElementById("contact-cta");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-brand-gold hover:bg-brand-gold-dark text-white font-black px-8 py-4 rounded-2xl shadow-lg shadow-brand-gold/20 flex items-center gap-2 w-fit"
              >
                <MessageCircle className="w-4 h-4" />
                تواصل معنا للمزيد من التفاصيل
              </Button>
            </div>

            {/* 5. تفاصيل المحاور */}
            {finalReportData.axis_breakdown && finalReportData.axis_breakdown.length > 0 && (
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-brand-dark mb-8">
                  تفاصيل المحاور
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {finalReportData.axis_breakdown.map((axis) => {
                    const axisScore = axis.axis_score ?? 0;
                    const mat = getMaturityLevel(axisScore);
                    const progressPercent = (axisScore / 5) * 100;
                    const treatmentMeta = getAxisTreatmentPath(axis.title ?? "");

                    return (
                      <Card
                        key={axis.axis_id}
                        className="border-none shadow-xl bg-white overflow-hidden rounded-[2rem] border-b-8 border-brand-gold/10"
                      >
                        <CardContent className="p-6 sm:p-8">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-black text-brand-dark text-base sm:text-lg max-w-[65%] leading-tight">
                              {axis.title}
                            </h4>
                            <div className={`text-2xl sm:text-3xl font-black ${mat.color}`}>
                              {axisScore.toFixed(2)} / 5
                            </div>
                          </div>

                          {axis.axis_message && (
                            <div
                              className={`flex items-start gap-2 rounded-xl border px-3 py-2 mb-4 ${
                                axis.axis_color === "green"
                                  ? "bg-green-50 border-green-200 text-green-800"
                                  : axis.axis_color === "blue"
                                    ? "bg-blue-50 border-blue-200 text-blue-800"
                                    : axis.axis_color === "yellow"
                                      ? "bg-yellow-50 border-yellow-300 text-yellow-900"
                                      : axis.axis_color === "orange"
                                        ? "bg-orange-50 border-orange-300 text-orange-900"
                                        : "bg-red-50 border-red-300 text-red-800"
                              }`}
                            >
                              <span className="text-sm shrink-0 mt-0.5">💡</span>
                              <p className="text-xs font-bold leading-relaxed">
                                {axis.axis_message}
                              </p>
                            </div>
                          )}

                          <div className="h-4 bg-brand-light rounded-full mb-3 overflow-hidden p-0.5 shadow-inner">
                            <div
                              className={`h-full rounded-full ${mat.bgColor}`}
                              style={{
                                width: `${progressPercent}%`,
                                transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
                              }}
                            />
                          </div>

                          <div className="flex justify-between items-center text-xs font-black mb-4">
                            <span className={mat.color}>{mat.label}</span>
                          </div>

                          {/* مسار المعالجة */}
                          <div className="bg-brand-light-gold/40 rounded-xl p-3 border border-brand-gold/20 space-y-1">
                            <p className="text-xs font-black text-brand-gray uppercase tracking-widest">
                              مسار المعالجة
                            </p>
                            <p className="text-sm font-black text-brand-gold">
                              {treatmentMeta.treatmentPath}
                            </p>
                            <p className="text-xs font-bold text-brand-dark">
                              الأداة المناسبة: <span className="text-brand-dark font-black">{axis.recommendation_platform || treatmentMeta.primaryProduct}</span>
                              {treatmentMeta.supportingProduct && (
                                <span className="text-brand-gray"> · {treatmentMeta.supportingProduct}</span>
                              )}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. الأولويات المقترحة للبدء */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <h3 className="text-xl sm:text-2xl font-black text-brand-dark">
                  الأولويات المقترحة للبدء
                </h3>
                <span className="bg-brand-light-gold text-brand-gold border border-brand-gold/30 px-3 py-1 rounded-full text-xs font-black">
                  أهم 5 تدخلات
                </span>
              </div>

              <div className="space-y-4">
                {TOP_5_PRIORITIES.map((item) => (
                  <div
                    key={item.order}
                    className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="bg-brand-gold text-white w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg shrink-0">
                      {item.order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-brand-dark text-base mb-1">
                        {item.intervention}
                      </p>
                      <p className="text-xs text-brand-gray font-bold">
                        {item.relatedAxes.join(" · ")}
                      </p>
                    </div>
                    <div className="bg-brand-light-gold/50 border border-brand-gold/20 px-4 py-2 rounded-xl shrink-0">
                      <p className="text-xs font-black text-brand-gray uppercase tracking-wider mb-0.5">
                        الأداة المناسبة
                      </p>
                      <p className="text-sm font-black text-brand-gold">{item.primaryProduct}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. خارطة المعالجة خلال 90 يوم */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Calendar className="w-6 h-6 text-brand-gold" />
                <h3 className="text-xl sm:text-2xl font-black text-brand-dark">
                  خارطة المعالجة خلال 90 يوم
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ROADMAP_90.map((phase) => (
                  <div key={phase.phase} className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <div className={`${phase.colorClass} p-5 text-white`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 opacity-80" />
                        <span className="text-xs font-black uppercase tracking-widest opacity-80">
                          {phase.phase}
                        </span>
                      </div>
                      <h4 className="font-black text-base leading-tight">{phase.label}</h4>
                    </div>
                    <div className="p-5">
                      <ul className="space-y-2 mb-5">
                        {phase.actions.map((action, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                            <span className="text-xs text-brand-dark font-bold leading-relaxed">{action}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-xs font-black text-brand-gray uppercase tracking-widest mb-2">
                          الأدوات المناسبة
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {phase.products.map((p) => (
                            <span key={p} className="bg-brand-light-gold border border-brand-gold/20 text-brand-dark text-xs font-black px-2.5 py-1 rounded-full">
                              {p}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs font-bold text-brand-gray leading-relaxed">
                          <span className="text-brand-dark font-black">المخرج المتوقع: </span>
                          {phase.expectedOutput}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. فقرة جاهزة للتقرير */}
            <div className="bg-brand-light rounded-[2rem] p-8 sm:p-10 border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-brand-dark text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                  فقرة جاهزة للتقرير
                </span>
              </div>
              <p className="text-brand-dark font-bold leading-loose text-base sm:text-lg">
                بناءً على نتائج تقييم نضج المنظومة المجتمعية لـ<span className="text-brand-gold font-black">{orgName}</span>،
                والتي أظهرت متوسطاً عاماً قدره{" "}
                <span className="font-black">{overallScore.toFixed(2)} / 5</span> وتصنيفاً ضمن مستوى{" "}
                <span className={`font-black ${maturity.color}`}>{maturity.label}</span>،
                فإن المنظمة تحتاج إلى مسار معالجة مؤسسي متكامل يبدأ بإعادة بناء التوجه الاستراتيجي
                والحوكمة والتشغيل، ويمتد إلى تأسيس منظومة قياس أداء وأثر، وتنظيم البيانات والتحول الرقمي،
                ورفع جاهزية الفريق ومجلس الإدارة.
              </p>
            </div>

          </div>

          {/* 9. زر تحميل التقرير (bottom) */}
          <div className="flex justify-center mt-10">
            <Button
              onClick={exportToPDF}
              disabled={isExporting}
              className="flex items-center gap-2 bg-brand-dark hover:bg-brand-dark/90 text-white font-black rounded-2xl px-10 py-5 text-base shadow-xl transition-all disabled:opacity-60"
            >
              {isExporting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جارٍ التصدير...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  تحميل التقرير PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section - تواصل معنا */}
      <section id="contact-cta" className="bg-brand-dark py-16 sm:py-20 relative overflow-hidden mx-0">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/10 blur-[120px] -mr-40 -mt-40" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <span className="bg-brand-gold/20 text-brand-gold px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 inline-block">
            الخطوة التالية
          </span>
          <h3 className="text-[clamp(1.6rem,2.4vw,2.75rem)] font-black text-white mb-5">
            هل أنت مستعد للبدء في مسار المعالجة؟
          </h3>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
            فريقنا جاهز لمرافقتك خطوة بخطوة في مسار التطوير المؤسسي المناسب لمنظمتك.
            تواصل معنا لتحديد موعد اجتماع ومناقشة خطة المعالجة بالتفصيل.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-brand-gold hover:bg-brand-gold-dark text-white px-8 py-5 rounded-2xl font-black text-base shadow-2xl shadow-brand-gold/30 flex items-center gap-3 justify-center"
              onClick={() => window.open("https://wa.me/966500000000", "_blank")}
            >
              <MessageCircle className="w-5 h-5" />
              تواصل معنا عبر واتساب
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white bg-transparent px-8 py-5 rounded-2xl font-black text-base hover:bg-white/10 transition-all flex items-center gap-3 justify-center"
              onClick={() => window.open("https://calendly.com", "_blank")}
            >
              <Calendar className="w-5 h-5" />
              تحديد موعد اجتماع
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
