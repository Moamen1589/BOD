import { useState, useEffect, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, Download, ArrowLeft, Rocket } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  fetchFinalReport,
  type FinalReportData,
} from "@/lib/complianceAssessment";

const assessmentAxes = [
  {
    title: "الحوكمة والامتثال النظامي",
    platform: "مسرعة أثر وريادة",
  },
  {
    title: "القيادة والاستراتيجية",
    platform: "مسرعة أثر وريادة",
  },
  {
    title: "التخطيط والتشغيل",
    platform: "مسرعة أثر وريادة",
  },
  {
    title: "إدارة المشاريع",
    platform: "مختبرات حقق",
  },
  {
    title: "قياس الأداء والأثر",
    platform: "منصة أداء",
  },
  {
    title: "الإدارة المالية والاستدامة",
    platform: "مسرعة أثر وريادة",
  },
  {
    title: "الموارد البشرية وبناء القدرات",
    platform: "أكاديمية حقق",
  },
  {
    title: "التقنية والتحول الرقمي",
    platform: "عباق وأثر 360",
  },
  {
    title: "الاتصال المؤسسي والسرد",
    platform: "أكاديمية حقق",
  },
  {
    title: "الإنسانية وأصحاب المصلحة",
    platform: "مسرعة أثر وريادة",
  },
];

export default function FinalReportPage() {
  const [, params] = useRoute("/final-report/:submissionId");
  const [, setLocation] = useLocation();
  const [finalReportData, setFinalReportData] =
    useState<FinalReportData | null>(null);
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

        if (!isMounted) {
          return;
        }

        setFinalReportData(reportData);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(
          err instanceof Error ? err.message : "تعذر تحميل التقرير النهائي",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadFinalReport();

    return () => {
      isMounted = false;
    };
  }, [submissionId]);

  const getMaturityLevel = (avg: number) => {
    if (avg >= 4.5)
      return { label: "امتثال مؤسسي ناضج", color: "text-green-600" };
    if (avg >= 3.5) return { label: "امتثال جيد", color: "text-blue-600" };
    if (avg >= 2.5) return { label: "امتثال متوسط", color: "text-yellow-600" };
    if (avg >= 1.5) return { label: "امتثال ضعيف", color: "text-orange-600" };
    return { label: "خطر مؤسسي", color: "text-red-600" };
  };

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
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
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
      pdf.save("report.pdf");
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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-brand-light/50 to-white overflow-hidden">
        <div ref={heroRef} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 blur-[120px] -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] -ml-20 -mb-20" />
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

          <h1 className="text-[clamp(2rem,4vw,4.5rem)] font-black text-brand-dark mb-4 leading-tight">
            التقرير النهائي
          </h1>
          <p className="text-[clamp(1rem,1.5vw,1.25rem)] text-brand-gray max-w-3xl font-bold">
            نتائج تقييم النضج المؤسسي الشامل
          </p>
        </div>
      </section>

      {/* Report Section */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="space-y-10 sm:space-y-12">
            <div className="flex justify-end">
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

            <div ref={resultRef}>
              {/* Main Score Section */}
              <div className="bg-brand-dark text-white p-8 sm:p-12 lg:p-16 rounded-[2.5rem] sm:rounded-[3.5rem] lg:rounded-[5rem] text-center relative overflow-hidden shadow-2xl mb-10">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <div className="relative z-10">
                  <h2 className="text-[clamp(1.8rem,3.2vw,3.75rem)] font-black mb-8 sm:mb-12">
                    نتيجة تشخيص المنظومة المجتمعية
                  </h2>

                  <div className="flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-16 mb-10 sm:mb-16">
                    <div className="w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 rounded-full border-[12px] sm:border-[16px] lg:border-[20px] border-brand-gold flex flex-col items-center justify-center bg-white text-brand-dark shadow-2xl transform hover:rotate-6 transition-transform">
                      <span className="text-5xl font-black">
                        {finalReportData.submission?.overall_score?.toFixed(
                          2,
                        ) ?? "—"}{" "}
                        / 5
                      </span>
                      <span className="text-xs font-black text-brand-gray uppercase tracking-widest mt-1">
                        المتوسط العام
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-brand-gold mb-3 sm:mb-4">
                        مستوى النضج المؤسسي:
                      </p>
                      <h3
                        className={`text-[clamp(2rem,3.4vw,4.2rem)] font-black ${
                          getMaturityLevel(
                            finalReportData.submission?.overall_score ?? 0,
                          ).color
                        } mb-6 sm:mb-8 leading-tight drop-shadow-md`}
                      >
                        {finalReportData.submission?.compliance_level || "—"}
                      </h3>

                      {finalReportData.submission?.compliance_message && (
                        <p className="text-sm sm:text-base text-white/80 font-bold italic leading-relaxed">
                          "{finalReportData.submission.compliance_message}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Organization & Submission Info */}
              <div className=" mb-10">
                <div className="bg-brand-light-gold/40 p-8 rounded-[2rem] border border-brand-gold/20">
                  <h3 className="text-sm font-black text-brand-gold uppercase tracking-widest mb-3">
                    المنظمة
                  </h3>
                  <p className="text-2xl sm:text-3xl font-black text-brand-dark mb-2">
                    {finalReportData.organization?.name || "—"}
                  </p>
                </div>

              </div>

              {/* Completion Metrics */}
              <div className="bg-white border-2 border-brand-gold/20 p-8 sm:p-10 lg:p-12 rounded-[2rem] mb-10">
                <h3 className="text-lg sm:text-xl font-black text-brand-dark mb-6">
                  نسبة إكمال التقييم
                </h3>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-4xl sm:text-5xl font-black text-brand-gold">
                      {finalReportData.completion?.percentage?.toFixed(1) ||
                        "0"}
                      %
                    </p>
                    <p className="text-xs sm:text-sm text-brand-gray font-bold mt-2">
                      {finalReportData.completion?.answered_questions || 0} من{" "}
                      {finalReportData.completion?.total_questions || 0} سؤال
                    </p>
                  </div>
                  <div className="flex-1 h-4 bg-brand-light rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-gold to-amber-500 transition-all duration-500"
                      style={{
                        width: `${finalReportData.completion?.percentage || 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Evaluator Notes */}
              {finalReportData.submission?.evaluator_notes && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 sm:p-8 rounded-r-xl mb-10">
                  <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-3">
                    ملاحظات المقيّم
                  </h3>
                  <p className="text-blue-800 font-bold leading-relaxed">
                    {finalReportData.submission.evaluator_notes}
                  </p>
                </div>
              )}

              {/* Axes Details */}
              {finalReportData.axis_breakdown &&
                finalReportData.axis_breakdown.length > 0 && (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-brand-dark mb-8">
                      تفاصيل المحاور
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {finalReportData.axis_breakdown.map((axis) => {
                        const axisScore = axis.axis_score ?? 0;
                        const maturity = getMaturityLevel(axisScore);
                        const progressPercent = (axisScore / 5) * 100;

                        return (
                          <Card
                            key={axis.axis_id}
                            className="border-none shadow-2xl bg-white overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] border-b-8 border-brand-gold/10"
                          >
                            <CardContent className="p-6 sm:p-8 lg:p-10">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-black text-brand-dark text-[clamp(1rem,1.5vw,1.25rem)] lg:text-2xl max-w-[70%] leading-tight">
                                  {axis.title}
                                </h4>
                                <div
                                  className={`text-[clamp(1.6rem,2.4vw,2.5rem)] font-black ${maturity.color}`}
                                >
                                  {axisScore.toFixed(2)} / 5
                                </div>
                              </div>

                              {axis.axis_message && (
                                <div
                                  className={`flex items-start gap-2 rounded-xl border px-3 py-2 mb-5 ${
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
                                  <span className="text-sm shrink-0 mt-0.5">
                                    💡
                                  </span>
                                  <p className="text-xs font-bold leading-relaxed">
                                    {axis.axis_message}
                                  </p>
                                </div>
                              )}

                              <div className="h-5 bg-brand-light rounded-full mb-4 overflow-hidden p-0.5 shadow-inner">
                                <div
                                  className={`h-full rounded-full ${maturity.color.replace("text", "bg")}`}
                                  style={{
                                    width: `${progressPercent}%`,
                                    transition:
                                      "width 1.2s cubic-bezier(0.4,0,0.2,1)",
                                  }}
                                />
                              </div>

                              <div className="flex justify-between items-center text-xs font-black mb-4">
                                <span className={maturity.color}>
                                  {maturity.label}
                                </span>
                              </div>

                              {axis.show_recommendation &&
                                axis.recommendation_platform && (
                                  <div className="bg-brand-light-gold/40 rounded-lg p-3 border border-brand-gold/20">
                                    <p className="text-xs font-bold text-brand-dark">
                                      💡 التوصية:{" "}
                                      <span className="text-brand-gold font-black">
                                        {axis.recommendation_platform}
                                      </span>
                                    </p>
                                  </div>
                                )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-light-gold p-8 sm:p-12 lg:p-16 rounded-[2.5rem] sm:rounded-[3.5rem] lg:rounded-[5rem] border-4 border-brand-gold/20 text-center shadow-xl mx-4 sm:mx-6 mb-16">
        <HelpCircle className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-brand-gold mx-auto mb-6 sm:mb-8" />
        <h3 className="text-[clamp(1.6rem,2.4vw,2.5rem)] font-black mb-6 sm:mb-8 text-brand-dark">
          الخطوات التالية
        </h3>
        <p className="text-[clamp(0.95rem,1.3vw,1.05rem)] lg:text-xl text-brand-gray mb-6 sm:mb-10 lg:mb-12 leading-relaxed max-w-4xl mx-auto font-medium">
          بناءً على نتائج التقييم، نوصيك بالالتحاق ببرامجنا المتخصصة لتحسين
          مستوى النضج المؤسسي في المجالات التي تحتاج تطويراً.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button
            asChild
            className="bg-brand-dark text-white px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 rounded-xl text-[clamp(0.95rem,1.3vw,1rem)] lg:text-lg font-black shadow-2xl hover:scale-105 transition-transform"
          >
            <a href="https://example.com/programs">
              <Rocket className="w-5 h-5 ml-2" />
              استكشف برامجنا
            </a>
          </Button>
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="border-brand-dark text-brand-dark px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 rounded-xl text-[clamp(0.95rem,1.3vw,1rem)] lg:text-lg font-black"
          >
            العودة للصفحة الرئيسية
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
