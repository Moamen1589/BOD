import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Target,
  ShieldCheck,
  Users,
  RefreshCw,
  Zap,
  Network,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  LayoutDashboard,
  Map,
  TrendingUp,
  FileText,
  Lightbulb,
  Info,
  CheckCircle2,
  BarChart,
  Brain,
  MessageSquare,
  ThumbsUp,
  ArrowLeft,
  Layout,
  Shield,
  Search,
  CheckCircle,
  HelpCircle,
  Clock,
  Rocket,
  XCircle,
  Download,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Progress } from "@/components/ui/progress";
import { hasCompletedRegistration } from "@/lib/registration";

const COMMUNITY_HERO_API_BASE = "https://gold-weasel-489740.hostingersite.com";
const COMMUNITY_HERO_SLIDES_ENDPOINT = `${COMMUNITY_HERO_API_BASE}/api/hero/slides`;

type CommunityHeroSlide = {
  title_ar?: string | null;
  subtitle_ar?: string | null;
  logo_url?: string | null;
};

const resolveCommunityHeroAssetUrl = (assetPath?: string | null) => {
  if (!assetPath) return null;
  if (/^https?:\/\//i.test(assetPath)) return assetPath;
  if (assetPath.startsWith("/storage/")) {
    return `${COMMUNITY_HERO_API_BASE}${assetPath}`;
  }

  const normalizedPath = assetPath.replace(/^\/+/, "");
  if (normalizedPath.startsWith("storage/")) {
    return `${COMMUNITY_HERO_API_BASE}/${normalizedPath}`;
  }

  return `${COMMUNITY_HERO_API_BASE}/storage/${normalizedPath}`;
};

const arkan = [
  {
    id: "purpose",
    title: "الغاية والأثر المجتمعي",
    description:
      "وضوح الغرض المجتمعي للمنظمة وتحديد الأهداف التي تترجم إلى أثر ملموس في المجتمع، مع وجود آلية لقياس الأثر بشكل دوري.",
    indicators: [
      "وضوح الرسالة المجتمعية لجميع الأفراد المعنيين",
      "قياس الأثر المجتمعي بانتظام",
      "توافق الأهداف مع أهداف التنمية المستدامة ورؤية المملكة 2030",
    ],
    color: "bg-purple-500",
    textColor: "text-purple-500",
    icon: Target,
  },
  {
    id: "integrity",
    title: "النزاهة المجتمعية والحوكمة",
    description:
      "الشفافية والمساءلة في الحوكمة من الأسس التي تُسهم في نجاح التحول المجتمعي، مع مواءمة القرارات مع القيم المجتمعية التي تتبناها المنظمة.",
    indicators: [
      "وجود ميثاق القيم المجتمعية الملتزم به من الجميع",
      "تطبيق الشفافية في جميع القرارات الإدارية",
      "وجود آليات للإفصاح والمساءلة",
    ],
    color: "bg-blue-500",
    textColor: "text-blue-500",
    icon: ShieldCheck,
  },
  {
    id: "empowerment",
    title: "التمكين والمشاركة الاجتماعية",
    description:
      "تمكين الأفراد والمجتمعات في اتخاذ القرارات المتعلقة بهم يُعد جوهر التحول المجتمعي المستدام، مع تشجيع المشاركة الفعّالة في جميع جوانب العمل.",
    indicators: [
      "تعزيز ثقافة المشاركة المجتمعية الفعّالة",
      "تمكين جميع الفئات المجتمعية في اتخاذ القرارات",
      "توفير منصات للحديث عن القضايا المحلية",
    ],
    color: "bg-green-500",
    textColor: "text-green-500",
    icon: Users,
  },
  {
    id: "innovation",
    title: "التجديد والتكيّف المجتمعي",
    description:
      "من خلال الابتكار الاجتماعي، يتم التكيّف مع التغيرات في البيئة الاجتماعية وتقديم حلول مجتمعية جديدة لمواجهة التحديات المتزايدة.",
    indicators: [
      "تبني الابتكار كجزء من الثقافة المؤسسية",
      "استخدام التكنولوجيا لتحسين الأداء المجتمعي",
      "التكيّف مع التغيرات الاجتماعية والاقتصادية",
    ],
    color: "bg-orange-500",
    textColor: "text-orange-500",
    icon: RefreshCw,
  },
  {
    id: "capacity",
    title: "الكفاءة التشغيلية",
    description:
      "القدرة على إدارة الموارد والعمليات بشكل فعّال لضمان تنفيذ الأهداف المجتمعية بكفاءة تشغيلية عالية.",
    indicators: [
      "تخصيص الموارد بشكل يتماشى مع الأهداف المجتمعية",
      "تطوير وتحسين العمليات الداخلية في المنظمة",
      "تحقيق الفعالية التشغيلية في إدارة الأنشطة المجتمعية",
    ],
    color: "bg-red-500",
    textColor: "text-red-500",
    icon: Zap,
  },
  {
    id: "sustainability",
    title: "الشراكات والنظم البيئية",
    description:
      "الاستدامة المجتمعية لا تتحقق في عزلة؛ لذا فإن بناء شراكات استراتيجية مع القطاع الخاص والحكومة والمجتمع المحلي يضمن تحقيق الأثر المستدام.",
    indicators: [
      "بناء شراكات مستدامة مع قطاعات متعددة",
      "إنشاء بيئة تدعم الابتكار المجتمعي المستدام",
      "الحصول على تمويل مستدام للمشروعات المجتمعية",
    ],
    color: "bg-amber-500",
    textColor: "text-amber-500",
    icon: Network,
  },
];

const assessmentAxes = [
  {
    title: "الحوكمة والامتثال النظامي",
    questions: [
      "وجود مجلس إدارة فعّال",
      "اجتماعات دورية موثقة",
      "لجان فاعلة",
      "سياسات مكتوبة ومعتمدة",
      "إدارة المخاطر",
      "الامتثال للأنظمة",
    ],
    platform: "مسرعة أثر وريادة",
    recommendation: "التوصية بالتسجيل في مسرعة أثر وريادة",
  },
  {
    title: "القيادة والاستراتيجية",
    questions: [
      "رؤية ورسالة معتمدة",
      "خطة استراتيجية محدثة",
      "ارتباط الأهداف بالأثر",
      "متابعة تنفيذ الاستراتيجية",
      "قرارات مبنية على بيانات",
    ],
    platform: "مسرعة أثر وريادة",
    recommendation: "التوصية بالتسجيل في مسرعة أثر وريادة",
  },
  {
    title: "التخطيط والتشغيل",
    questions: [
      "خطة تشغيلية واضحة",
      "إدارة المهام والأنشطة",
      "تقارير تشغيلية دورية",
      "وضوح الأدوار والمسؤوليات",
      "كفاءة العمليات",
    ],
    platform: "مسرعة أثر وريادة",
    recommendation: "التوصية بالتسجيل في مسرعة أثر وريادة",
  },
  {
    title: "إدارة المشاريع (مختبرات حقق)",
    questions: [
      "إدارة المشاريع بمنهجية واضحة",
      "اختبار الجاهزية قبل الإطلاق",
      "تقارير مرحلية",
      "إدارة المخاطر",
      "قابلية التوسع",
    ],
    platform: "مختبرات حقق",
    recommendation: "التوصية بالتسجيل في مختبرات حقق",
  },
  {
    title: "قياس الأداء والأثر (منصة أداء)",
    questions: [
      "مؤشرات أداء واضحة",
      "قياس دوري للأداء",
      "تقارير أثر معتمدة",
      "شهادات أداء",
      "استخدام النتائج في القرار",
    ],
    platform: "منصة أداء",
    recommendation: "التوصية بالتسجيل في منصة أداء",
  },
  {
    title: "الإدارة المالية والاستدامة",
    questions: [
      "سياسات مالية معتمدة",
      "شفافية مالية",
      "تنويع مصادر الدخل",
      "تقارير مالية منتظمة",
      "جاهزية تمويلية",
    ],
    platform: "مسرعة أثر وريادة",
    recommendation: "التوصية بالتسجيل في مسرعة أثر وريادة",
  },
  {
    title: "الموارد البشرية وبناء القدرات",
    questions: [
      "هيكل تنظيمي واضح",
      "توصيف وظيفي",
      "تقييم أداء الموظفين",
      "خطط تطوير وتدريب",
      "استقرار الفريق",
    ],
    platform: "اكاديمية حقق",
    recommendation: "التوصية بالتسجيل في اكاديمية حقق",
  },
  {
    title: "التقنية والتحول الرقمي",
    questions: [
      "استخدام أنظمة معتمدة",
      "توحيد البيانات",
      "أمن المعلومات",
      "أتمتة العمليات",
      "استخدام الذكاء في القرار",
    ],
    platform: "عباق وأثر 360",
    recommendation: "التوصية بالتسجيل في عباق وأثر 360",
  },
  {
    title: "الاتصال المؤسسي والسرد",
    questions: [
      "استراتيجية اتصال",
      "شفافية التواصل",
      "سرد الأثر",
      "قنوات فعالة",
      "تفاعل أصحاب المصلحة",
    ],
    platform: "اكاديمية حقق",
    recommendation: "التوصية بالتسجيل في اكاديمية حقق",
  },
  {
    title: "الإنسانية وأصحاب المصلحة",
    questions: [
      "تمكين المستفيدين",
      "مراعاة العاملين",
      "شمولية القرار",
      "عدالة الإجراءات",
      "أثر اجتماعي حقيقي",
    ],
    platform: "مسرعة أثر وريادة",
    recommendation: "التوصية بالتسجيل في مسرعة أثر وريادة",
  },
];

export default function ECSTTPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"intro" | "assessment" | "result">("intro");
  const [hasRegistration, setHasRegistration] = useState(false);
  const [activeAxisIndex, setActiveAxisIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [selectedRukn, setSelectedRukn] = useState<string | null>("purpose");
  const [cycleRadius, setCycleRadius] = useState(220);
  const [progressValues, setProgressValues] = useState<Record<number, number>>(
    {},
  );
  const [isExporting, setIsExporting] = useState(false);
  const [heroSlide, setHeroSlide] = useState<CommunityHeroSlide | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const heroRef = useScrollAnimation();
  const problemsRef = useScrollAnimation();
  const houseRef = useScrollAnimation();
  const journeyRef = useScrollAnimation();
  const cycleRef = useScrollAnimation();
  const assessmentRef = useScrollAnimation();

  useEffect(() => {
    const updateRadius = () => {
      const width = window.innerWidth;
      if (width < 640) setCycleRadius(120);
      else if (width < 1024) setCycleRadius(170);
      else setCycleRadius(275);
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadHeroSlide = async () => {
      try {
        const response = await fetch(COMMUNITY_HERO_SLIDES_ENDPOINT);
        if (!response.ok) return;

        const payload = await response.json();
        const firstSlide = Array.isArray(payload?.data)
          ? payload.data[0]
          : undefined;

        if (!firstSlide || !isMounted) return;

        setHeroSlide({
          title_ar: firstSlide.title_ar,
          subtitle_ar: firstSlide.subtitle_ar,
          logo_url: firstSlide.logo_url,
        });
      } catch {
        // Keep static fallback values when API is unavailable.
      }
    };

    loadHeroSlide();

    return () => {
      isMounted = false;
    };
  }, []);

  const heroLogoUrl =
    resolveCommunityHeroAssetUrl(heroSlide?.logo_url) ||
    "/images/cstt-logo.jpg";
  const heroTitle =
    heroSlide?.title_ar?.trim() ||
    "حوّل جمعيتك إلى مؤسسة تُدار بالأثر، لا بالاجتهاد";
  const heroSubtitle =
    heroSlide?.subtitle_ar?.trim() ||
    "رحلة متكاملة تبدأ بالتشخيص وتنتهي بالجاهزية التمويلية، عبر منظومة واحدة تجمع التخطيط، التشغيل، القياس، والحوكمة.";

  useEffect(() => {
    const storedOrgId = localStorage.getItem("orgId");
    const urlOrgId = new URLSearchParams(window.location.search).get("orgId");

    if (urlOrgId && urlOrgId !== storedOrgId) {
      localStorage.setItem("orgId", urlOrgId);
      setHasRegistration(true);
      return;
    }

    setHasRegistration(hasCompletedRegistration() || Boolean(storedOrgId));
  }, []);

  useEffect(() => {
    setProgressValues({});
    if (step !== "result") return;
    const timeout = setTimeout(() => {
      const vals: Record<number, number> = {};
      assessmentAxes.forEach((a, i) => {
        vals[i] = parseFloat(getAxisAverage(a.title).toString());
      });
      setProgressValues(vals);
    }, 150);
    return () => clearTimeout(timeout);
  }, [step]);

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
        allowTaint: true,
        backgroundColor: "#f9f5f0",
        logging: false,
        windowWidth: 1200,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const usableW = pageW - margin * 2;
      const imgH = (canvas.height * usableW) / canvas.width;
      let yPos = margin;
      let remaining = imgH;
      let srcY = 0;
      const pxPerMm = canvas.width / usableW;
      while (remaining > 0) {
        const sliceH = Math.min(remaining, pageH - margin * 2);
        const slicePx = sliceH * pxPerMm;
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = slicePx;
        const ctx = sliceCanvas.getContext("2d")!;
        ctx.drawImage(
          canvas,
          0,
          srcY,
          canvas.width,
          slicePx,
          0,
          0,
          canvas.width,
          slicePx,
        );
        const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.92);
        pdf.addImage(sliceData, "JPEG", margin, yPos, usableW, sliceH);
        remaining -= sliceH;
        srcY += slicePx;
        if (remaining > 0) {
          pdf.addPage();
          yPos = margin;
        }
      }
      pdf.save(
        `تقرير-التقييم-المؤسسي-${new Date().toLocaleDateString("ar-SA").replace(/\//g, "-")}.pdf`,
      );
    } catch (err) {
      console.error("PDF export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleScoreChange = (
    axisTitle: string,
    qIndex: number,
    value: number,
  ) => {
    setResponses((prev) => ({
      ...prev,
      [`${axisTitle}-${qIndex}`]: value,
    }));
  };

  const getAxisAverage = (axisTitle: string) => {
    const axis = assessmentAxes.find((a) => a.title === axisTitle);
    if (!axis) return 0;
    const scores = axis.questions.map(
      (_, i) => responses[`${axisTitle}-${i}`] || 0,
    );
    const sum = scores.reduce((a, b) => a + b, 0);
    return axis.questions.length ? (sum / axis.questions.length).toFixed(1) : 0;
  };

  const getOverallAverage = () => {
    const averages = assessmentAxes.map((a) =>
      parseFloat(getAxisAverage(a.title).toString()),
    );
    const sum = averages.reduce((a, b) => a + b, 0);
    return (sum / assessmentAxes.length).toFixed(2);
  };

  const getMaturityLevel = (avg: number) => {
    if (avg >= 4.5)
      return {
        label: "امتثال مؤسسي ناضج",
        color: "text-green-500",
        stage: "مستدامة",
      };
    if (avg >= 3.5)
      return { label: "امتثال جيد", color: "text-blue-500", stage: "ناضجة" };
    if (avg >= 2.5)
      return {
        label: "امتثال متوسط",
        color: "text-yellow-500",
        stage: "نامية",
      };
    if (avg >= 1.5)
      return { label: "امتثال ضعيف", color: "text-orange-500", stage: "ناشئة" };
    return { label: "خطر مؤسسي", color: "text-red-500", stage: "ناشئة" };
  };

  const getScoreDescription = (
    score: number,
  ): { label: string; color: string } => {
    if (score >= 5)
      return { label: "امتثال كامل ومستدام", color: "text-green-600" };
    if (score >= 4)
      return { label: "امتثال جيد مع تحسينات بسيطة", color: "text-blue-600" };
    if (score >= 3) return { label: "امتثال جزئي", color: "text-amber-600" };
    if (score >= 2) return { label: "ضعف امتثال", color: "text-orange-600" };
    if (score >= 1) return { label: "عدم امتثال", color: "text-red-600" };
    return { label: "غير مطبق", color: "text-gray-500" };
  };

  const getRecommendation = () => {
    const averages = assessmentAxes.map((a) => ({
      title: a.title,
      score: parseFloat(getAxisAverage(a.title).toString()),
    }));
    const weakest = averages.reduce(
      (min, cur) => (cur.score < min.score ? cur : min),
      averages[0],
    );

    if (weakest.title.includes("الحوكمة") || weakest.title.includes("القيادة"))
      return {
        platform: "مسرعة أثر وريادة",
        link: "",
        cta: "التسجيل في مسرعة أثر وريادة",
      };
    if (weakest.title.includes("إدارة المشاريع"))
      return {
        platform: "مختبرات حقق",
        link: "",
        cta: "التسجيل في مختبرات حقق",
      };
    if (weakest.title.includes("قياس الأداء"))
      return {
        platform: "منصة أداء",
        link: "",
        cta: "التسجيل في منصة أداء",
      };
    if (
      weakest.title.includes("الإدارة المالية") ||
      weakest.title.includes("الإنسانية")
    )
      return {
        platform: "مسرعة أثر وريادة",
        link: "",
        cta: "التسجيل في مسرعة أثر وريادة",
      };
    if (
      weakest.title.includes("الموارد البشرية") ||
      weakest.title.includes("الاتصال المؤسسي")
    )
      return {
        platform: "اكاديمية حقق",
        link: "",
        cta: "التسجيل في اكاديمية حقق",
      };
    if (weakest.title.includes("التقنية"))
      return {
        platform: "عباق وأثر 360",
        link: "",
        cta: "التسجيل في عباق وأثر 360",
      };
    if (weakest.title.includes("التخطيط والتشغيل"))
      return {
        platform: "مسرعة أثر وريادة",
        link: "",
        cta: "التسجيل في مسرعة أثر وريادة",
      };

    return {
      platform: "مسرعة أثر وريادة",
      link: "",
      cta: "التسجيل في مسرعة أثر وريادة",
    };
  };

  const recommendation = getRecommendation();
  const currentAxis = assessmentAxes[activeAxisIndex];
  const answeredCountInCurrentAxis = currentAxis.questions.filter((_, i) =>
    Object.prototype.hasOwnProperty.call(
      responses,
      `${currentAxis.title}-${i}`,
    ),
  ).length;
  const isCurrentAxisComplete =
    answeredCountInCurrentAxis === currentAxis.questions.length;
  const missingAnswersCount =
    currentAxis.questions.length - answeredCountInCurrentAxis;

  const handleAssessmentEntry = () => {
    if (hasRegistration) {
      setStep("assessment");
      document
        .getElementById("assessment")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setLocation("/register");
    scroll(0, 0);
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col font-almarai bg-white overflow-x-hidden"
      dir="rtl"
    >
      <Navbar />

      {/* Hero Section */}
      <section
        ref={heroRef.ref}
        className={`pt-24 sm:pt-28 md:pt-40 pb-12 sm:pb-16 md:pb-24 bg-brand-dark text-white relative overflow-hidden transition-all duration-1000 ${heroRef.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">
          <img
            src={heroLogoUrl}
            alt="شعار CSTT"
            className="w-28 h-28 md:w-40 md:h-40 object-cover rounded-full mb-8 md:mb-10 shadow-2xl border-4 border-white transition-transform hover:scale-105"
          />
          <h1 className="max-w-5xl mx-auto text-[clamp(1.7rem,3.6vw,3.65rem)] font-black mb-5 sm:mb-6 md:mb-8 leading-[1.25] sm:leading-[1.18] md:leading-[1.15] [text-wrap:balance]">
            {heroTitle}
          </h1>
          <p className="text-[clamp(1rem,1.6vw,1.5rem)] text-white/70 mb-6 sm:mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
            {heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
            <Button
              onClick={() =>
                document
                  .getElementById("assessment")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              size="lg"
              className="bg-brand-gold hover:bg-transparent hover:border-white/20 hover:border text-white px-7 sm:px-8 md:px-12 py-4 sm:py-6 md:py-8 rounded-2xl font-bold shadow-2xl shadow-brand-gold/30 text-[clamp(1rem,1.6vw,1.125rem)] md:text-xl w-full sm:w-auto"
            >
              قيّم جاهزية جمعيتك الآن
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white bg-transparent px-7 sm:px-8 md:px-12 py-4 sm:py-6 md:py-8 rounded-2xl font-bold text-[clamp(1rem,1.6vw,1.125rem)] md:text-xl hover:bg-brand-gold transition-all w-full sm:w-auto"
            >
              تحدث مع مستشاري المنظومة
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/10 blur-[150px] -mr-64 -mt-64"></div>
      </section>

      {/* Problems Section */}
      <section
        ref={problemsRef.ref}
        className={`py-0 bg-white transition-all duration-1000 ${problemsRef.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} overflow-hidden`}
      >
        <div className="flex flex-col lg:flex-row min-h-[520px] lg:min-h-[700px]">
          {/* Left — Problems */}
          <div className="lg:w-1/2 bg-[#F8F8F8] px-6 sm:px-8 lg:px-10 py-12 sm:py-16 lg:py-20 flex flex-col justify-center">
            <span className="bg-red-100 text-red-600 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 inline-block w-fit">
              تشخيص الواقع
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-4 leading-tight">
              هل هذا يشبه
              <br />
              واقع جمعيتك؟
            </h2>
            <p className="text-brand-gray mb-8 sm:mb-10 text-sm sm:text-base">
              المشكلة ليست في النية... المشكلة في غياب المنظومة.
            </p>

            <div className="space-y-4">
              {[
                {
                  problem: "تعمل بجهد كبير دون قياس واضح للأثر",
                  detail: "لا يوجد نظام يترجم العمل اليومي إلى أرقام موثقة",
                  emoji: "📊",
                },
                {
                  problem: "تطلق مشاريع قبل اختبار جاهزيتها المؤسسية",
                  detail: "مشاريع تُبنى على الحماس لا على التخطيط الممنهج",
                  emoji: "🚀",
                },
                {
                  problem: "تمتلك خططًا لا تتحول إلى تنفيذ فعلي",
                  detail: "الخطط تُكتب وتُحفظ دون متابعة أو محاسبة",
                  emoji: "📋",
                },
                {
                  problem: "تعاني من ضغط التقارير والحوكمة المتزايد",
                  detail: "متطلبات الجهات الرقابية تستنزف وقت الفريق",
                  emoji: "⚖️",
                },
                {
                  problem: "تعتمد على تمويل موسمي غير مستدام",
                  detail: "دورة تمويل هشة تهدد استمرارية البرامج والفريق",
                  emoji: "💰",
                },
                {
                  problem: "غياب الرؤية المؤسسية الموحدة",
                  detail: "كل قسم يسير بوجهته دون بوصلة مشتركة",
                  emoji: "🎯",
                },
              ].map(({ problem, detail, emoji }, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-red-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-xl shrink-0">
                    {emoji}
                  </div>
                  <div>
                    <p className="font-black text-brand-dark text-sm leading-snug">
                      {problem}
                    </p>
                    <p className="text-brand-gray text-xs mt-0.5">{detail}</p>
                  </div>
                  <XCircle
                    className="text-red-300 shrink-0 mr-auto"
                    size={18}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Divider Arrow */}
          <div className="hidden lg:flex items-center justify-center w-0 relative z-10">
            <div className="absolute w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center shadow-2xl shadow-brand-gold/40 -translate-x-1/2">
              <ChevronLeft className="text-white w-7 h-7" />
            </div>
          </div>

          {/* Right — ECSTT Solution */}
          <div className="lg:w-1/2 bg-brand-dark px-10 py-20 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-brand-gold/10 blur-[100px] -ml-32 -mt-32 pointer-events-none"></div>
            <div className="relative z-10">
              <span className="bg-brand-gold/20 text-brand-gold px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 inline-block">
                الحل
              </span>

              {/* ECSTT Logo */}
              <div className="mb-8 flex items-center gap-5">
                <img
                  src="/images/cstt-logo.jpg"
                  alt="ECSTT Logo"
                  className="w-20 h-20 rounded-2xl shadow-xl border-2 border-white/10 object-cover shrink-0"
                />
                <div>
                  <h3 className="text-white font-black text-2xl leading-tight">
                    المنظومة المجتمعية
                  </h3>
                  <p className="text-brand-gold font-bold text-sm">ECSTT</p>
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                منظومة واحدة
                <br />
                <span className="text-brand-gold">تحل كل هذه المشاكل</span>
              </h2>
              <p className="text-white/60 mb-10 text-base leading-relaxed">
                رحلة متكاملة تبدأ بالتشخيص وتنتهي بالجاهزية التمويلية — تجمع
                التخطيط، التشغيل، القياس، والحوكمة في مكان واحد.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  { solution: "قياس الأثر الفعلي", icon: "✅" },
                  { solution: "خطط تتحول إلى تنفيذ موثق", icon: "✅" },
                  { solution: "جاهزية تمويلية واستدامة", icon: "✅" },
                  { solution: "حوكمة وامتثال مبسّط", icon: "✅" },
                  { solution: "رؤية مؤسسية موحدة", icon: "✅" },
                  { solution: "مشاريع مبنية على بيانات", icon: "✅" },
                ].map(({ solution, icon }, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-lg">{icon}</span>
                    <span className="text-white font-bold text-sm">
                      {solution}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() =>
                  document
                    .getElementById("assessment")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-brand-gold hover:bg-brand-gold-dark text-white px-8 py-5 rounded-2xl font-black text-base shadow-xl shadow-brand-gold/30 w-fit"
              >
                قيّم جاهزية جمعيتك الآن ←
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* House Model Section */}
      <section
        ref={houseRef.ref}
        className={`py-24 bg-brand-dark text-white overflow-hidden relative transition-all duration-1000 ${houseRef.isVisible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              نموذج المنزل الشامل
            </h2>
            <p className="text-brand-gold text-2xl font-bold">
              بناء مؤسسي قوي لنتائج قابلة للقياس
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {/* Roof */}
            <div className="bg-brand-gold p-10 rounded-t-[5rem] text-center shadow-2xl relative border-b-4 border-black/10">
              <h3 className="text-3xl font-black mb-3">
                السقف - الفهم والرؤية
              </h3>
              <p className="text-white font-bold text-lg">
                تحليل الواقع • فهم المتغيرات • مواءمة الأنظمة والسوق
              </p>
            </div>
            {/* Floors */}
            <div className="bg-white/5 p-10 text-center border-x-8 border-brand-gold/20 backdrop-blur-sm">
              <h3 className="text-3xl font-black mb-3 text-brand-gold">
                الطابق العلوي - الريادة
              </h3>
              <p className="text-white/80 font-bold text-lg">
                تشخيص حقيقي • حلول عملية • قيادة التغيير
              </p>
            </div>
            <div className="bg-white/10 p-16 text-center border-x-8 border-brand-gold/30 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-gold/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              <h3 className="text-4xl font-black mb-4 relative z-10">
                القلب - التشغيل
              </h3>
              <p className="text-brand-gold text-2xl font-black relative z-10">
                تشخيص ← تخطيط ← تنفيذ ← قياس ← تحسين
              </p>
            </div>
            <div className="bg-white/5 p-10 text-center border-x-8 border-brand-gold/20 backdrop-blur-sm">
              <h3 className="text-3xl font-black mb-3 text-brand-gold">
                الطابق السفلي - الاحتراف
              </h3>
              <p className="text-white/80 font-bold text-lg">
                حوكمة • إدارة • تقارير • مؤشرات أداء
              </p>
            </div>
            {/* Foundation */}
            <div className="bg-brand-gold/20 border-8 border-brand-gold/40 p-12 rounded-b-3xl text-center shadow-inner">
              <h3 className="text-3xl font-black mb-3 text-brand-gold">
                الأساس - الأثر والاستدامة
              </h3>
              <p className="text-white font-bold text-lg">
                أثر موثق • ثقة الممولين • جاهزية تمويلية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Association Journey */}
      <section
        ref={journeyRef.ref}
        className={`py-24 bg-white transition-all duration-1000 ${journeyRef.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-brand-dark mb-6">
              رحلة الجمعية معنا
            </h2>
            <div className="w-32 h-2 bg-brand-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                title: "التشخيص والتهيئة",
                desc: "تشخيص مؤسسي وتقييم الحوكمة",
                output: "تقرير تشخيص معتمد",
                icon: Search,
              },
              {
                title: "التخطيط والتحول",
                desc: "خطة تحسين وتشغيل وتحديد RACI",
                output: "خطط قابلة للتنفيذ",
                icon: Layout,
              },
              {
                title: "التشغيل المنضبط",
                desc: "تحويل الخطط لمهام ونظام عباق",
                output: "تشغيل مستقر ومنضبط",
                icon: Zap,
              },
              {
                title: "القياس والأثر",
                desc: "مؤشرات الأداء وتقارير الأثر",
                output: "أثر موثق بالأرقام",
                icon: TrendingUp,
              },
              {
                title: "الجاهزية التمويلية",
                desc: "ملف تمويلي وشفافية مالية",
                output: "جاهزية حقيقية للتمويل",
                icon: Shield,
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="relative p-5 bg-brand-light-gold rounded-[2.5rem] border border-brand-gold/10 hover:shadow-2xl transition-all group overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 bg-brand-gold text-white w-10 h-10 flex items-center justify-center font-black rounded-bl-2xl">
                  {idx + 1}
                </div>
                <div className="bg-white p-4 rounded-2xl w-fit mb-6 text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-colors shadow-sm">
                  <step.icon size={28} />
                </div>
                <h4 className="text-xl font-black mb-4 text-brand-dark">
                  {step.title}
                </h4>
                <p className="text-brand-gray text-sm mb-6 leading-relaxed">
                  {step.desc}
                </p>
                <div className="bg-brand-dark text-white px-4 py-3  rounded-2xl  font-bold mt-auto  w-full  mx-auto">
                  <span className="flex items-center justify-center gap-2 mb-1 ">
                    <span className="text-xs">المخرج: {step.output}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Cycle Section */}
      <section
        ref={cycleRef.ref}
        className={`py-32 bg-brand-light transition-all duration-1000 ${cycleRef.isVisible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-brand-dark mb-6">
              دائرة المنظومة المجتمعية
            </h2>
            <p className="text-brand-gray text-xl max-w-2xl mx-auto">
              تكامل الأركان الستة لتحقيق التحول المجتمعي المستدام
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20">
            {/* The Cycle Circle - FIXED AND FUNCTIONAL */}
            <div
              className="relative shrink-0"
              style={{
                width: `${cycleRadius * 2}px`,
                height: `${cycleRadius * 2}px`,
              }}
            >
              {/* Main Outer Path Ring */}
              <div
                className="absolute inset-0 border-white rounded-full shadow-inner"
                style={{
                  borderWidth: `${cycleRadius < 150 ? 10 : cycleRadius < 220 ? 16 : 28}px`,
                }}
              ></div>

              {arkan.map((item, idx) => {
                const angle = idx * 60 - 90; // Start from top
                const isSelected = selectedRukn === item.id;
                const nodeSize =
                  cycleRadius < 150 ? 52 : cycleRadius < 220 ? 64 : 96;
                const iconSize =
                  cycleRadius < 150 ? 22 : cycleRadius < 220 ? 26 : 36;
                const ringThickness =
                  cycleRadius < 150 ? 10 : cycleRadius < 220 ? 16 : 28;
                const orbitRadius =
                  cycleRadius - ringThickness / 2 - nodeSize / 2;

                // Calculate position on the circle
                const x = Math.cos(angle * (Math.PI / 180)) * orbitRadius;
                const y = Math.sin(angle * (Math.PI / 180)) * orbitRadius;

                return (
                  <div
                    key={item.id}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <button
                      onClick={() => setSelectedRukn(item.id)}
                      className={`pointer-events-auto absolute rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl border-4 border-white z-30 ${isSelected ? "scale-125 ring-8 ring-brand-gold/20" : "hover:scale-115 opacity-90"} ${item.color}`}
                      style={{
                        width: `${nodeSize}px`,
                        height: `${nodeSize}px`,
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                    >
                      <item.icon
                        className="text-white"
                        style={{
                          width: `${iconSize}px`,
                          height: `${iconSize}px`,
                        }}
                      />
                    </button>
                  </div>
                );
              })}

              {/* Central Hub with Logo */}
              <div
                className="absolute inset-0 m-auto bg-white rounded-full flex items-center justify-center z-10 shadow-2xl border-4 p-4 sm:p-5 overflow-hidden"
                style={{
                  width: `${cycleRadius < 150 ? 110 : cycleRadius < 220 ? 150 : 220}px`,
                  height: `${cycleRadius < 150 ? 110 : cycleRadius < 220 ? 150 : 220}px`,
                }}
              >
                <img
                  src="/images/cstt-logo.jpg"
                  alt="Logo"
                  className="w-full h-auto rounded-full"
                />
              </div>
            </div>

            {/* Detail View - Responsive Content */}
            <div className="max-w-xl w-full">
              {selectedRukn ? (
                <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-2 border-brand-gold/10 animate-in fade-in slide-in-from-left-8 duration-700 relative">
                  <div className="absolute -top-6 -right-6 bg-brand-gold text-white p-4 rounded-3xl shadow-lg">
                    {(() => {
                      const RuknIcon =
                        arkan.find((r) => r.id === selectedRukn)?.icon || Info;
                      return <RuknIcon size={40} />;
                    })()}
                  </div>
                  <h3 className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-black mb-6 text-brand-dark">
                    {arkan.find((r) => r.id === selectedRukn)?.title}
                  </h3>
                  <div
                    className={`w-20 h-1.5 ${arkan.find((r) => r.id === selectedRukn)?.color} mb-8 rounded-full`}
                  ></div>
                  <p className="text-xl text-brand-gray mb-10 leading-relaxed font-medium">
                    {arkan.find((r) => r.id === selectedRukn)?.description}
                  </p>

                  <div className="space-y-6">
                    <h4 className="text-xl font-black text-brand-dark flex items-center gap-3">
                      <BarChart className="text-brand-gold w-6 h-6" />
                      مؤشرات التحول:
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      {(
                        arkan.find((r) => r.id === selectedRukn)?.indicators ||
                        []
                      ).map((indicator, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 bg-brand-light-gold/50 p-5 rounded-2xl border border-brand-gold/10"
                        >
                          <CheckCircle className="text-green-500 w-6 h-6 shrink-0" />
                          <span className="font-bold text-brand-dark">
                            {indicator}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-brand-light p-8 sm:p-12 lg:p-16 rounded-[2.5rem] sm:rounded-[3rem] lg:rounded-[4rem] text-center border-4 border-dashed border-brand-gold/20 flex flex-col items-center">
                  <Brain className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-brand-gold/30 mb-6 sm:mb-8" />
                  <p className="text-[clamp(1rem,1.6vw,1.125rem)] lg:text-2xl text-brand-gray font-black">
                    الرجاء الضغط على أحد الأركان لاستعراض خارطة التحول
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results Roadmap */}
      <section className="py-16 sm:py-20 lg:py-24 bg-brand-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-[clamp(1.6rem,2.6vw,3rem)] font-black mb-10 sm:mb-16">
            نتائج متوقعة خلال 90 يوم
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            {[
              { icon: Shield, label: "حوكمة مفعّلة" },
              { icon: Zap, label: "تشغيل منضبط" },
              { icon: Layout, label: "تقارير جاهزة" },
              { icon: BarChart, label: "لوحة أداء واضحة" },
              { icon: TrendingUp, label: "جاهزية تمويلية" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 p-5 sm:p-7 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] flex flex-col items-center gap-4 sm:gap-5 lg:gap-6 border border-white/10 hover:border-brand-gold/50 transition-all group"
              >
                <item.icon className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-brand-gold group-hover:scale-110 transition-transform" />
                <span className="text-[clamp(0.9rem,1.2vw,1.25rem)] font-black">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-8 sm:mt-12 lg:mt-16 text-[clamp(0.9rem,1.2vw,1.25rem)] text-white/50 font-bold">
            بدون تعقيد… وبدون تحميل الجمعية ما لا تحتمل
          </p>
        </div>
      </section>

      {/* Detailed Assessment Survey */}
      <section
        ref={assessmentRef.ref}
        className="py-20 sm:py-28 lg:py-32 bg-white"
        id="assessment"
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          {step === "intro" && (
            <div className="text-center bg-brand-light-gold p-8 sm:p-12 lg:p-20 rounded-[2.5rem] sm:rounded-[3.5rem] lg:rounded-[5rem] border-4 border-brand-gold/20 relative overflow-hidden shadow-2xl">
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-brand-gold/10 rounded-full"></div>
              <Rocket className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-brand-gold mx-auto mb-6 sm:mb-8" />
              <h2 className="text-[clamp(1.8rem,3vw,3.5rem)] font-black text-brand-dark mb-6 sm:mb-8">
                ابدأ بناء جمعية جاهزة للأثر
              </h2>
              <p className="text-[clamp(1rem,1.6vw,1.125rem)] md:text-xl lg:text-2xl text-brand-gray mb-8 sm:mb-12 lg:mb-16 leading-relaxed font-medium">
                لا تبدأ بمشروع جديد… ابدأ ببناء الأساس الصحيح. قيم جاهزيتك الآن
                عبر نموذج الامتثال السنوي.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  onClick={handleAssessmentEntry}
                  size="lg"
                  className="bg-brand-dark text-white px-8 sm:px-12 lg:px-16 py-5 sm:py-7 lg:py-10 rounded-2xl sm:rounded-3xl text-[clamp(1rem,1.6vw,1.125rem)] lg:text-2xl font-black shadow-2xl w-full sm:w-auto"
                >
                  🚀 ابدأ رحلة جمعيتك الآن
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-brand-dark text-brand-dark px-8 sm:px-12 lg:px-16 py-5 sm:py-7 lg:py-10 rounded-2xl sm:rounded-3xl text-[clamp(1rem,1.6vw,1.125rem)] lg:text-2xl font-black w-full sm:w-auto"
                >
                  📋 احصل على تقييم مجاني
                </Button>
              </div>
            </div>
          )}

          {step === "assessment" && (
            <div className="bg-white shadow-2xl rounded-[2.5rem] sm:rounded-[3rem] lg:rounded-[4rem] border border-brand-light overflow-hidden">
              <div className="bg-brand-dark p-6 sm:p-8 lg:p-12 text-white flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
                <div>
                  <h2 className="text-[clamp(1.6rem,2.4vw,2.5rem)] font-black mb-4 underline decoration-brand-gold underline-offset-8">
                    تقييم نضج المنظومة
                  </h2>
                  <div className="flex items-center gap-4">
                    <span className="bg-brand-gold text-white px-4 py-1 rounded-lg text-sm font-black">
                      المحور {activeAxisIndex + 1}
                    </span>
                    <p className="text-base sm:text-xl lg:text-2xl font-bold text-white/90">
                      {assessmentAxes[activeAxisIndex].title}
                    </p>
                  </div>
                </div>
                <div className="bg-white/10 p-4 sm:p-5 lg:p-6 rounded-3xl text-center border border-white/10 min-w-[110px] sm:min-w-[130px]">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-gold">
                    {Math.round(
                      ((activeAxisIndex + 1) / assessmentAxes.length) * 100,
                    )}
                    %
                  </div>
                  <p className="text-xs text-white/50 mt-2 font-bold uppercase tracking-widest">
                    Progress
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-10 lg:p-20">
                <div className="space-y-12">
                  {assessmentAxes[activeAxisIndex].questions.map((q, qIdx) => {
                    const scoreKey = `${assessmentAxes[activeAxisIndex].title}-${qIdx}`;
                    const selectedScore = responses[scoreKey] || 0;
                    const scoreDescription = getScoreDescription(selectedScore);

                    return (
                      <div
                        key={qIdx}
                        className="p-5 sm:p-7 lg:p-10 bg-brand-light-gold/30 rounded-[1.75rem] sm:rounded-[2.25rem] lg:rounded-[2.5rem] border-2 border-brand-gold/5 hover:border-brand-gold/20 transition-all"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 sm:mb-8 lg:mb-10 gap-4 sm:gap-6">
                          <label className="text-[clamp(1rem,1.5vw,1.25rem)] lg:text-2xl font-black text-brand-dark leading-tight">
                            {q}
                          </label>
                          <div className="bg-brand-dark text-brand-gold w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center text-[clamp(1.6rem,2.4vw,2.5rem)] font-black shadow-xl">
                            {selectedScore}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6 lg:gap-8">
                          <div className="text-xs font-black text-red-500 uppercase tracking-tighter shrink-0">
                            خطر مؤسسي
                          </div>
                          <div className="w-full sm:flex-grow">
                            <Slider
                              dir="rtl"
                              min={0}
                              max={5}
                              step={1}
                              value={[selectedScore]}
                              onValueChange={(value) =>
                                handleScoreChange(
                                  assessmentAxes[activeAxisIndex].title,
                                  qIdx,
                                  value[0] ?? 0,
                                )
                              }
                              className="w-full"
                            />
                            <div className="relative mt-4 h-4">
                              <div className="absolute inset-x-0 top-0 flex justify-between">
                                {[0, 1, 2, 3, 4, 5].map((v) => (
                                  <div key={v} className="relative w-0">
                                    <span className="absolute top-0 -translate-x-1/2 text-[10px] font-bold text-brand-gray/40 whitespace-nowrap">
                                      {v}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`text-xs font-black tracking-tight shrink-0 text-right max-w-[190px] sm:max-w-[230px] leading-relaxed ${scoreDescription.color}`}
                          >
                            {scoreDescription.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row justify-between mt-10 sm:mt-14 lg:mt-20 gap-6">
                  <Button
                    variant="outline"
                    disabled={activeAxisIndex === 0}
                    onClick={() => setActiveAxisIndex((prev) => prev - 1)}
                    className="flex-1 py-4 sm:py-6 lg:py-10 rounded-2xl sm:rounded-3xl border-4 border-brand-dark text-brand-dark text-[clamp(1rem,1.6vw,1.125rem)] lg:text-2xl font-black hover:bg-brand-dark hover:text-white transition-all"
                  >
                    المحور السابق
                  </Button>
                  {activeAxisIndex === assessmentAxes.length - 1 ? (
                    <Button
                      onClick={() => {
                        if (!isCurrentAxisComplete) return;
                        setStep("result");
                      }}
                      disabled={!isCurrentAxisComplete}
                      className="flex-[2] bg-brand-gold text-white py-4 sm:py-6 lg:py-10 rounded-2xl sm:rounded-3xl text-lg sm:text-2xl lg:text-3xl font-black shadow-2xl shadow-brand-gold/30"
                    >
                      إصدار التقرير النهائي 📊
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        if (!isCurrentAxisComplete) return;
                        setActiveAxisIndex((prev) => prev + 1);
                      }}
                      disabled={!isCurrentAxisComplete}
                      className="flex-[2] bg-brand-dark text-white py-4 sm:py-6 lg:py-10 rounded-2xl sm:rounded-3xl text-[clamp(1rem,1.6vw,1.125rem)] lg:text-2xl font-black shadow-2xl"
                    >
                      حفظ والمتابعة للمحور التالي
                    </Button>
                  )}
                </div>

                {!isCurrentAxisComplete && (
                  <p className="mt-4 text-center text-sm sm:text-base font-bold text-red-600">
                    يرجى تعبئة جميع عناصر هذا المحور قبل المتابعة. المتبقي:{" "}
                    {missingAnswersCount}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === "result" && (
            <div className="space-y-10 sm:space-y-12 animate-in fade-in zoom-in duration-1000">
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
                <div className="bg-brand-dark text-white p-8 sm:p-12 lg:p-16 rounded-[2.5rem] sm:rounded-[3.5rem] lg:rounded-[5rem] text-center relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                  <div className="relative z-10">
                    <h2 className="text-[clamp(1.8rem,3.2vw,3.75rem)] font-black mb-8 sm:mb-12">
                      نتيجة تشخيص المنظومة المجتمعية
                    </h2>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-16 mb-10 sm:mb-16">
                      <div className="w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 rounded-full border-[12px] sm:border-[16px] lg:border-[20px] border-brand-gold flex flex-col items-center justify-center bg-white text-brand-dark shadow-2xl transform hover:rotate-6 transition-transform">
                        <span className="text-4xl sm:text-5xl lg:text-7xl font-black">
                          {getOverallAverage()} / 5
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
                          className={`text-[clamp(2rem,3.4vw,4.2rem)] font-black ${getMaturityLevel(parseFloat(getOverallAverage())).color} mb-6 sm:mb-8 leading-tight drop-shadow-md`}
                        >
                          {
                            getMaturityLevel(parseFloat(getOverallAverage()))
                              .label
                          }
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mt-2 w-full">
                          {[
                            {
                              range: "4.5 – 5",
                              label: "امتثال مؤسسي ناضج",
                              min: 4.5,
                              activeClass:
                                "bg-green-500 border-green-500 text-white",
                              inactiveClass:
                                "border-green-500/30 text-green-400/40",
                            },
                            {
                              range: "3.5 – 4.4",
                              label: "امتثال جيد",
                              min: 3.5,
                              activeClass:
                                "bg-blue-500 border-blue-500 text-white",
                              inactiveClass:
                                "border-blue-400/30 text-blue-300/40",
                            },
                            {
                              range: "2.5 – 3.4",
                              label: "امتثال متوسط",
                              min: 2.5,
                              activeClass:
                                "bg-yellow-500 border-yellow-400 text-white",
                              inactiveClass:
                                "border-yellow-400/30 text-yellow-300/40",
                            },
                            {
                              range: "1.5 – 2.4",
                              label: "امتثال ضعيف",
                              min: 1.5,
                              activeClass:
                                "bg-orange-500 border-orange-500 text-white",
                              inactiveClass:
                                "border-orange-400/30 text-orange-300/40",
                            },
                            {
                              range: "أقل من 1.5",
                              label: "خطر مؤسسي",
                              min: 0,
                              activeClass:
                                "bg-red-500 border-red-500 text-white",
                              inactiveClass:
                                "border-red-400/30 text-red-300/40",
                            },
                          ].map((level, idx, arr) => {
                            const avg = parseFloat(getOverallAverage());
                            const maxVal = idx === 0 ? 5 : arr[idx - 1].min;
                            const isActive = avg >= level.min && avg < maxVal;
                            return (
                              <div
                                key={level.label}
                                className={`px-3 py-2 rounded-2xl text-center border-2 transition-all ${isActive ? level.activeClass + " scale-105 shadow-lg" : level.inactiveClass}`}
                              >
                                <div className="text-[10px] font-bold opacity-80 mb-0.5 whitespace-nowrap">
                                  {level.range}
                                </div>
                                <div className="text-xs font-black leading-tight">
                                  {level.label}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 sm:p-10 lg:p-12 rounded-[2.5rem] sm:rounded-[3rem] lg:rounded-[4rem] border border-brand-gold/20 shadow-xl">
                  <div className="text-center mb-8 sm:mb-10">
                    <h3 className="text-[clamp(1.4rem,2.2vw,2.2rem)] font-black text-brand-dark mb-3">
                      الأركان الستة للمنظومة
                    </h3>
                    <p className="text-brand-gray font-bold">
                      تذكير بمحاور التحول المؤسسي التي تقود نتيجة النضج
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {arkan.map((rukn) => (
                      <div
                        key={rukn.id}
                        className="bg-brand-light-gold/30 border border-brand-gold/15 rounded-3xl p-5 sm:p-6"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 ${rukn.color}`}
                          >
                            <rukn.icon size={24} />
                          </div>
                          <div>
                            <h4 className="font-black text-brand-dark text-base sm:text-lg leading-tight mb-2">
                              {rukn.title}
                            </h4>
                            <p className="text-sm text-brand-gray leading-relaxed">
                              {rukn.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {assessmentAxes.map((a, i) => {
                    const avg = parseFloat(getAxisAverage(a.title).toString());
                    const maturity = getMaturityLevel(avg);
                    const animWidth = `${((progressValues[i] ?? 0) / 5) * 100}%`;
                    const getPlatformMsg = (
                      score: number,
                      platform: string,
                    ) => {
                      if (score >= 4.5) return null;
                      if (score >= 3.5)
                        return {
                          text: `يمكن الاستفادة من ${platform} لتعزيز هذا المحور`,
                          style: "bg-blue-50 border-blue-200 text-blue-800",
                        };
                      if (score >= 2.5)
                        return {
                          text: `يُوصى بالالتحاق ببرنامج ${platform} لتطوير هذا المحور`,
                          style:
                            "bg-yellow-50 border-yellow-300 text-yellow-900",
                        };
                      return {
                        text: `يُوصى بشدة بالالتحاق بـ ${platform} — هذا المحور يحتاج تدخلاً عاجلاً`,
                        style: "bg-red-50 border-red-300 text-red-800",
                      };
                    };
                    const msg = getPlatformMsg(avg, a.platform);
                    return (
                      <Card
                        key={i}
                        className="border-none shadow-2xl bg-white overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] border-b-8 border-brand-gold/10"
                      >
                        <CardContent className="p-6 sm:p-8 lg:p-10">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-black text-brand-dark text-[clamp(1rem,1.5vw,1.25rem)] lg:text-2xl max-w-[70%] leading-tight">
                              {a.title}
                            </h4>
                            <div
                              className={`text-[clamp(1.6rem,2.4vw,2.5rem)] font-black ${maturity.color}`}
                            >
                              {getAxisAverage(a.title)} / 5
                            </div>
                          </div>
                          {msg && (
                            <div
                              className={`flex items-start gap-2 rounded-xl border px-3 py-2 mb-5 ${msg.style}`}
                            >
                              <span className="text-sm shrink-0 mt-0.5">
                                💡
                              </span>
                              <p className="text-xs font-bold leading-relaxed">
                                {msg.text}
                              </p>
                            </div>
                          )}
                          <div className="h-5 bg-brand-light rounded-full mb-4 overflow-hidden p-0.5 shadow-inner">
                            <div
                              className={`h-full rounded-full ${maturity.color.replace("text", "bg")}`}
                              style={{
                                width: animWidth,
                                transition:
                                  "width 1.2s cubic-bezier(0.4,0,0.2,1)",
                              }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-xs font-black">
                            <span className="text-brand-gray/50 uppercase">
                              Maturity Score
                            </span>
                            <span className={maturity.color}>
                              {maturity.label}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="bg-brand-light-gold p-8 sm:p-12 lg:p-16 rounded-[2.5rem] sm:rounded-[3.5rem] lg:rounded-[5rem] border-4 border-brand-gold/20 text-center shadow-xl">
                  <HelpCircle className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-brand-gold mx-auto mb-6 sm:mb-8" />
                  <h3 className="text-[clamp(1.6rem,2.4vw,2.5rem)] font-black mb-6 sm:mb-8 text-brand-dark">
                    خطة المعالجة الفورية
                  </h3>
                  <p className="text-[clamp(0.95rem,1.3vw,1.05rem)] lg:text-xl text-brand-gray mb-6 sm:mb-10 lg:mb-12 leading-relaxed max-w-4xl mx-auto font-medium">
                    بناءً على إحصائيات التقييم، المحور الأكثر احتياجاً للتدخل
                    لديك هو{" "}
                    <span className="font-black text-brand-dark  decoration-4 underline-offset-8 leading-[70px]">
                      {
                        assessmentAxes.reduce(
                          (min, cur) =>
                            parseFloat(getAxisAverage(cur.title).toString()) <
                            parseFloat(getAxisAverage(min.title).toString())
                              ? cur
                              : min,
                          assessmentAxes[0],
                        ).title
                      }
                    </span>
                    . التوجيه الأنسب الآن هو التسجيل في{" "}
                    <a
                      href={recommendation.link || "#"}
                      className="font-black text-brand-dark underline decoration-brand-gold decoration-4 underline-offset-8"
                    >
                      {recommendation.platform}
                    </a>
                    .
                  </p>
                  <div className="flex flex-col md:flex-row gap-8 justify-center">
                    <Button
                      asChild
                      size="lg"
                      className="bg-brand-dark text-white px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 rounded-xl sm:rounded-xl text-[clamp(0.95rem,1.3vw,1rem)] lg:text-xl font-black shadow-2xl hover:scale-105 transition-transform w-full md:w-auto"
                    >
                      <a href={recommendation.link || "#"}>
                        تفعيل فريق استشارات ولادة حلم
                      </a>
                    </Button>
                    <Button
                      onClick={() => {
                        setStep("intro");
                        setActiveAxisIndex(0);
                        setResponses({});
                      }}
                      variant="outline"
                      className="border-brand-dark text-brand-dark px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 rounded-xl sm:rounded-xl text-[clamp(0.95rem,1.3vw,1rem)] lg:text-xl font-black w-full sm:w-auto"
                    >
                      إعادة التشخيص الشامل
                    </Button>
                  </div>
                </div>
              </div>
              {/* end resultRef */}
            </div>
          )}
        </div>
      </section>

      {/* Community Platform CTA */}
      <section className="bg-brand-dark py-16 sm:py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/10 blur-[120px] -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] -ml-20 -mb-20" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left text */}
            <div className="lg:w-1/2">
              <span className="bg-brand-gold/20 text-brand-gold px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 inline-block">
                مجتمع مفتوح
              </span>
              <h2 className="text-[clamp(1.8rem,3.2vw,3.75rem)] font-black text-white mb-6 leading-tight">
                منصة تفاعلية
                <br />
                <span className="text-brand-gold">للمشاركة المجتمعية</span>
              </h2>
              <p className="text-white/60 text-[clamp(1rem,1.6vw,1.125rem)] lg:text-xl leading-relaxed mb-8 sm:mb-10">
                قيّم المبادرات، اترك تعليقك، وشارك برأيك مع مئات الجمعيات
                السعودية في منصة مجتمعية مفتوحة للجميع.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                {[
                  { icon: "⭐", label: "تصويت على المبادرات" },
                  { icon: "💬", label: "تعليقات عامة مفتوحة" },
                  { icon: "❤️", label: "إعجاب وتفاعل" },
                  { icon: "📣", label: "اقتراح مبادرات جديدة" },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl"
                  >
                    <span>{icon}</span>
                    <span className="text-white text-sm font-bold">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/voting">
                <Button className="bg-brand-gold hover:bg-brand-gold-dark text-white px-7 sm:px-10 py-4 sm:py-6 rounded-2xl font-black text-[clamp(1rem,1.6vw,1.125rem)] lg:text-xl shadow-2xl shadow-brand-gold/30 flex items-center gap-3 w-fit">
                  <ThumbsUp className="w-6 h-6" />
                  ادخل منصة التصويت
                </Button>
              </Link>
            </div>

            {/* Right — preview cards */}
            <div className="lg:w-1/2 space-y-4">
              {[
                {
                  name: "مبادرة إطعام",
                  cat: "الأمن الغذائي",
                  color: "bg-orange-500",
                  votes: 312,
                  comments: 47,
                  rating: 4.7,
                },
                {
                  name: "مبادرة رعاية",
                  cat: "رعاية الأسرة",
                  color: "bg-rose-500",
                  votes: 389,
                  comments: 63,
                  rating: 4.8,
                },
                {
                  name: "برنامج بداية",
                  cat: "التوظيف",
                  color: "bg-green-500",
                  votes: 241,
                  comments: 38,
                  rating: 4.6,
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center gap-4 sm:gap-5 hover:bg-white/10 transition-colors"
                >
                  <div
                    className={`${item.color} w-12 h-12 rounded-xl shrink-0 flex items-center justify-center`}
                  >
                    <span className="text-white font-black text-lg">
                      {item.rating}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-black text-base">
                      {item.name}
                    </p>
                    <p className="text-white/40 text-xs">{item.cat}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-center">
                      <p className="text-brand-gold font-black text-sm">
                        {item.votes}
                      </p>
                      <p className="text-white/40 text-xs">تصويت</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-black text-sm">
                        {item.comments}
                      </p>
                      <p className="text-white/40 text-xs">تعليق</p>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/voting">
                <div className="border-2 border-dashed border-white/20 rounded-2xl p-4 text-center text-white/40 hover:border-brand-gold/50 hover:text-brand-gold transition-all cursor-pointer font-bold text-sm">
                  + عرض كل المبادرات
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
