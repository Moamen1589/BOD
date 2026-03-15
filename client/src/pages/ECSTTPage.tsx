import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Progress } from "@/components/ui/progress";

const arkan = [
  {
    id: "purpose",
    title: "الغاية والأثر المجتمعي",
    description:
      "وضوح الغرض المجتمعي للمنظمة وتحديد الأهداف التي تترجم إلى أثر ملموس في المجتمع.",
    color: "bg-purple-500",
    textColor: "text-purple-500",
    icon: Target,
  },
  {
    id: "integrity",
    title: "النزاهة المجتمعية والحوكمة",
    description:
      "تعد الشفافية والمساءلة في الحوكمة من الأسس التي تُسهم في نجاح التحول المجتمعي.",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    icon: ShieldCheck,
  },
  {
    id: "empowerment",
    title: "التمكين والمشاركة الاجتماعية",
    description:
      "تمكين الأفراد والمجتمعات في اتخاذ القرارات المتعلقة بهم يُعتبر جوهرًا للتحول المجتمعي المستدام.",
    color: "bg-green-500",
    textColor: "text-green-500",
    icon: Users,
  },
  {
    id: "innovation",
    title: "التجديد والتكيّف المجتمعي",
    description:
      "من خلال الابتكار الاجتماعي، يتم التكيف مع التغيرات في البيئة الاجتماعية، مع تقديم حلول مجتمعية جديدة.",
    color: "bg-orange-500",
    textColor: "text-orange-500",
    icon: RefreshCw,
  },
  {
    id: "capacity",
    title: "الكفاءة التشغيلية",
    description:
      "القدرة على إدارة الموارد والعمليات بشكل فعّال لضمان تنفيذ الأهداف المجتمعية بكفاءة.",
    color: "bg-red-500",
    textColor: "text-red-500",
    icon: Zap,
  },
  {
    id: "sustainability",
    title: "الشراكات والنظم البيئية",
    description:
      "الاستدامة المجتمعية لا تتحقق في عزلة. لذا، بناء شراكات استراتيجية يضمن تحقيق الأثر المستدام.",
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
    const storedOrgId = localStorage.getItem("orgId");
    const urlOrgId = new URLSearchParams(window.location.search).get("orgId");

    if (urlOrgId && urlOrgId !== storedOrgId) {
      localStorage.setItem("orgId", urlOrgId);
      setHasRegistration(true);
      return;
    }

    setHasRegistration(Boolean(storedOrgId));
  }, []);

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

  const getRecommendation = () => {
    const averages = assessmentAxes.map((a) => ({
      title: a.title,
      score: parseFloat(getAxisAverage(a.title).toString()),
    }));
    const weakest = averages.reduce(
      (min, cur) => (cur.score < min.score ? cur : min),
      averages[0],
    );

    if (weakest.title.includes("قياس الأداء"))
      return {
        platform: "منصة أداء",
        link: "/solutions/adaa-platform",
        cta: "تفعيل منصة أداء",
      };
    if (weakest.title.includes("إدارة المشاريع"))
      return {
        platform: "مختبرات حقق",
        link: "/solutions/haqqiq-labs",
        cta: "تفعيل مختبرات حقق",
      };
    if (weakest.title.includes("التخطيط") || weakest.title.includes("التقنية"))
      return {
        platform: "نظام عباق",
        link: "/solutions",
        cta: "تفعيل نظام عباق",
      };
    return {
      platform: "فريق استشارات ولادة حلم",
      link: "https://wa.me/966567771966",
      cta: "تواصل مع فريق استشارات ولادة حلم",
      external: true,
    };
  };

  const recommendation = getRecommendation();

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
        className={`pt-28 md:pt-40 pb-16 md:pb-24 bg-brand-dark text-white relative overflow-hidden transition-all duration-1000 ${heroRef.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">
          <img
            src="/images/cstt-logo.jpg"
            alt="شعار CSTT"
            className="h-28 md:h-40 w-auto mb-8 md:mb-10 rounded-full shadow-2xl border-4 border-white transition-transform hover:scale-105"
          />
          <h1 className="max-w-5xl mx-auto text-[1.9rem] sm:text-[2.35rem] md:text-[2.9rem] lg:text-[3.65rem] font-black mb-5 sm:mb-6 md:mb-8 leading-[1.2] sm:leading-[1.18] md:leading-[1.15] [text-wrap:balance]">
            حوّل جمعيتك إلى مؤسسة تُدار بالأثر، لا بالاجتهاد
          </h1>
          <p className="text-lg md:text-2xl text-white/70 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
            رحلة متكاملة تبدأ بالتشخيص وتنتهي بالجاهزية التمويلية، عبر منظومة
            واحدة تجمع التخطيط، التشغيل، القياس، والحوكمة.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
            <Button
              onClick={() =>
                document
                  .getElementById("assessment")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              size="lg"
              className="bg-brand-gold hover:bg-transparent hover:border-white/20 hover:border text-white px-8 md:px-12 py-6 md:py-8 rounded-2xl font-bold shadow-2xl shadow-brand-gold/30 text-lg md:text-xl"
            >
              قيّم جاهزية جمعيتك الآن
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white bg-transparent px-8 md:px-12 py-6 md:py-8 rounded-2xl font-bold text-lg md:text-xl hover:bg-brand-gold transition-all"
            >
              تحدث مع مستشار المنظومة
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/10 blur-[150px] -mr-64 -mt-64"></div>
      </section>

      {/* Problems Section */}
      <section
        ref={problemsRef.ref}
        className={`py-14 sm:py-16 md:py-20 lg:py-24 bg-white transition-all duration-1000 ${problemsRef.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-12 md:mb-14 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-brand-dark mb-4 sm:mb-5 md:mb-6 leading-tight">
              هل هذا يشبه واقع جمعيتك؟
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-brand-gray leading-relaxed">
              المشكلة ليست في النية... المشكلة في غياب المنظومة.
            </p>
          </div>
          <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {[
              "تعمل بجهد كبير دون قياس واضح",
              "تطلق مشاريع قبل اختبار جاهزيتها",
              "تمتلك خططًا لا تتحول إلى تنفيذ",
              "تعاني من ضغط التقارير والحوكمة",
              "تعتمد على تمويل موسمي غير مستدام",
              "غياب الرؤية المؤسسية الموحدة",
            ].map((problem, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-[1.75rem] md:rounded-3xl bg-red-50 border border-red-100 shadow-sm min-h-[110px]"
              >
                <XCircle
                  className="text-red-500 shrink-0 mt-0.5 sm:mt-1"
                  size={22}
                />
                <span className="text-brand-dark font-bold text-sm sm:text-base md:text-lg leading-relaxed [text-wrap:balance]">
                  {problem}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Introduction */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-24 bg-brand-light-gold">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="max-w-5xl mx-auto text-[1.85rem] sm:text-[2.2rem] md:text-[2.7rem] lg:text-[3.25rem] font-black text-brand-dark mb-5 sm:mb-6 md:mb-8 leading-[1.2] sm:leading-[1.18] [text-wrap:balance]">
            منظومة واحدة… رحلة واضحة… نتائج قابلة للقياس
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-brand-gray max-w-4xl mx-auto leading-relaxed [text-wrap:balance]">
            نحن لا نقدم خدمة واحدة، بل نمكّنك من الدخول في رحلة تحول مؤسسي
            متكاملة مبنية على نموذج واضح يشبه بناء منزل قوي لجمعيتك.
          </p>
        </div>
      </section>

      {/* House Model Section */}
      <section
        ref={houseRef.ref}
        className={`py-16 md:py-24 bg-brand-dark text-white overflow-hidden relative transition-all duration-1000 ${houseRef.isVisible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-6">
              نموذج المنزل الشامل
            </h2>
            <p className="text-brand-gold text-lg md:text-2xl font-bold">
              بناء مؤسسي قوي لنتائج قابلة للقياس
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
            {/* Roof */}
            <div className="bg-brand-gold p-5 sm:p-6 md:p-10 rounded-t-[2.5rem] sm:rounded-t-[3.5rem] md:rounded-t-[5rem] text-center shadow-2xl relative border-b-4 border-black/10">
              <h3 className="text-2xl sm:text-3xl font-black mb-3">
                السقف - الفهم والرؤية
              </h3>
              <p className="text-white font-bold text-base md:text-lg">
                تحليل الواقع • فهم المتغيرات • مواءمة الأنظمة والسوق
              </p>
            </div>
            {/* Floors */}
            <div className="bg-white/5 p-5 sm:p-6 md:p-10 text-center border-x-4 sm:border-x-6 md:border-x-8 border-brand-gold/20 backdrop-blur-sm">
              <h3 className="text-2xl sm:text-3xl font-black mb-3 text-brand-gold">
                الطابق العلوي - الريادة
              </h3>
              <p className="text-white/80 font-bold text-base md:text-lg">
                تشخيص حقيقي • حلول عملية • قيادة التغيير
              </p>
            </div>
            <div className="bg-white/10 p-6 sm:p-10 md:p-16 text-center border-x-4 sm:border-x-6 md:border-x-8 border-brand-gold/30 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-gold/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 relative z-10">
                القلب - التشغيل
              </h3>
              <p className="text-brand-gold text-base sm:text-lg md:text-2xl font-black relative z-10">
                تشخيص ← تخطيط ← تنفيذ ← قياس ← تحسين
              </p>
            </div>
            <div className="bg-white/5 p-5 sm:p-6 md:p-10 text-center border-x-4 sm:border-x-6 md:border-x-8 border-brand-gold/20 backdrop-blur-sm">
              <h3 className="text-2xl sm:text-3xl font-black mb-3 text-brand-gold">
                الطابق السفلي - الاحتراف
              </h3>
              <p className="text-white/80 font-bold text-base md:text-lg">
                حوكمة • إدارة • تقارير • مؤشرات أداء
              </p>
            </div>
            {/* Foundation */}
            <div className="bg-brand-gold/20 border-4 sm:border-[6px] md:border-8 border-brand-gold/40 p-6 sm:p-8 md:p-12 rounded-b-2xl sm:rounded-b-3xl text-center shadow-inner">
              <h3 className="text-2xl sm:text-3xl font-black mb-3 text-brand-gold">
                الأساس - الأثر والاستدامة
              </h3>
              <p className="text-white font-bold text-base md:text-lg">
                أثر موثق • ثقة الممولين • جاهزية تمويلية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Association Journey */}
      <section
        ref={journeyRef.ref}
        className={`py-16 md:py-24 bg-white transition-all duration-1000 ${journeyRef.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-brand-dark mb-6">
              رحلة الجمعية معنا
            </h2>
            <div className="w-20 sm:w-32 h-2 bg-brand-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
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
                className="relative p-5 sm:p-6 md:p-8 bg-brand-light-gold rounded-[1.75rem] sm:rounded-[2.25rem] md:rounded-[2.5rem] border border-brand-gold/10 hover:shadow-2xl transition-all group overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-brand-gold text-white w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-black rounded-bl-2xl">
                  {idx + 1}
                </div>
                <div className="bg-white p-3 md:p-4 rounded-2xl w-fit mb-6 text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-colors shadow-sm">
                  <step.icon size={24} />
                </div>
                <h4 className="text-lg md:text-xl font-black mb-4 text-brand-dark">
                  {step.title}
                </h4>
                <p className="text-brand-gray text-sm mb-6 leading-relaxed">
                  {step.desc}
                </p>
                <div className="bg-brand-dark text-white text-center py-3  rounded-xl text-xs font-bold mt-auto">
                  المخرج: {step.output}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Cycle Section */}
      <section
        ref={cycleRef.ref}
        className={`py-20 md:py-32 bg-brand-light transition-all duration-1000 ${cycleRef.isVisible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-brand-dark mb-6">
              دائرة المنظومة المجتمعية
            </h2>
            <p className="text-brand-gray text-base md:text-xl max-w-2xl mx-auto">
              تكامل الأركان الستة لتحقيق التحول المجتمعي المستدام
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-20">
            {/* The Cycle Circle - FIXED AND FUNCTIONAL */}
            <div className="relative w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[550px] lg:h-[550px] shrink-0">
              {/* Main Outer Path Ring */}
              <div className="absolute inset-0 border-[12px] sm:border-[16px] lg:border-[30px] border-white rounded-full shadow-inner"></div>

              {arkan.map((item, idx) => {
                const angle = idx * 60 - 90; // Start from top
                const isSelected = selectedRukn === item.id;

                // Calculate position on the circle
                const radius = cycleRadius;
                const x = Math.cos(angle * (Math.PI / 180)) * (radius - 10);
                const y = Math.sin(angle * (Math.PI / 180)) * (radius - 10);

                return (
                  <div
                    key={item.id}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <button
                      onClick={() => setSelectedRukn(item.id)}
                      className={`pointer-events-auto absolute w-12 h-12 sm:w-16 sm:h-16 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl border-4 border-white z-30 ${isSelected ? "scale-110 md:scale-125 ring-4 md:ring-8 ring-brand-gold/20" : "hover:scale-110 opacity-90"} ${item.color}`}
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                    >
                      <item.icon className="text-white w-5 h-5 sm:w-7 sm:h-7 md:w-12 md:h-12" />
                    </button>

                    {/* Animated Ray Line */}
                    {/* <div 
                      className={`absolute w-1 h-32 md:w-2 md:h-48 ${item.color} origin-bottom z-20 transition-all duration-500 ${isSelected ? 'opacity-100' : 'opacity-20'}`}
                      style={{ 
                        transform: `rotate(${angle + 90}deg) translate(0, -140px) md:translate(0, -220px)`
                      }}
                    ></div> */}
                  </div>
                );
              })}

              {/* Central Hub with Logo */}
              <div className="absolute inset-0 m-auto w-24 h-24 sm:w-32 sm:h-32 md:w-56 md:h-56 bg-white rounded-full flex items-center justify-center z-10 shadow-2xl border-4 border-brand-light p-3 sm:p-4 md:p-6 overflow-hidden">
                <img
                  src="/images/cstt-logo.jpg"
                  alt="الشعار"
                  className="w-full h-auto rounded-full"
                />
              </div>
            </div>

            {/* Detail View - Responsive Content */}
            <div className="max-w-xl w-full">
              {selectedRukn ? (
                <div className="bg-white p-6 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[2.75rem] md:rounded-[3.5rem] shadow-2xl border-2 border-brand-gold/10 animate-in fade-in slide-in-from-left-8 duration-700 relative">
                  <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-brand-gold text-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-lg">
                    {(() => {
                      const RuknIcon =
                        arkan.find((r) => r.id === selectedRukn)?.icon || Info;
                      return (
                        <RuknIcon
                          size={28}
                          className="sm:w-9 sm:h-9 md:w-10 md:h-10"
                        />
                      );
                    })()}
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-5 sm:mb-6 text-brand-dark">
                    {arkan.find((r) => r.id === selectedRukn)?.title}
                  </h3>
                  <div
                    className={`w-20 h-1.5 ${arkan.find((r) => r.id === selectedRukn)?.color} mb-8 rounded-full`}
                  ></div>
                  <p className="text-base sm:text-lg md:text-2xl text-brand-gray mb-8 sm:mb-10 leading-relaxed font-medium">
                    {arkan.find((r) => r.id === selectedRukn)?.description}
                  </p>

                  <div className="space-y-4 sm:space-y-6">
                    <h4 className="text-lg sm:text-xl font-black text-brand-dark flex items-center gap-3">
                      <BarChart className="text-brand-gold w-6 h-6" />
                      مؤشرات التحول:
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-3 sm:gap-4 bg-brand-light-gold/50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-brand-gold/10">
                        <CheckCircle className="text-green-500 w-6 h-6 shrink-0" />
                        <span className="font-bold text-brand-dark text-sm sm:text-base">
                          تحقيق أثر مجتمعي ملموس وقابل للقياس
                        </span>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 bg-brand-light-gold/50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-brand-gold/10">
                        <CheckCircle className="text-green-500 w-6 h-6 shrink-0" />
                        <span className="font-bold text-brand-dark text-sm sm:text-base">
                          حوكمة مؤسسية تضمن الاستدامة والنمو
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-brand-light p-6 sm:p-10 md:p-16 rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] text-center border-4 border-dashed border-brand-gold/20 flex flex-col items-center">
                  <Brain className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-brand-gold/30 mb-6 sm:mb-8" />
                  <p className="text-base sm:text-lg md:text-2xl text-brand-gray font-black">
                    الرجاء الضغط على أحد الأركان لاستعراض خارطة التحول
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results Roadmap */}
      <section className="py-16 sm:py-20 md:py-24 bg-brand-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-10 sm:mb-12 md:mb-16">
            نتائج متوقعة خلال 90 يوم
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
            {[
              { icon: Shield, label: "حوكمة مفعّلة" },
              { icon: Zap, label: "تشغيل منضبط" },
              { icon: Layout, label: "تقارير جاهزة" },
              { icon: BarChart, label: "لوحة أداء واضحة" },
              { icon: TrendingUp, label: "جاهزية تمويلية" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 p-6 sm:p-8 md:p-10 rounded-[1.75rem] sm:rounded-[2.25rem] md:rounded-[3rem] flex flex-col items-center gap-4 sm:gap-6 border border-white/10 hover:border-brand-gold/50 transition-all group"
              >
                <item.icon className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-brand-gold group-hover:scale-110 transition-transform" />
                <span className="text-base sm:text-lg md:text-xl font-black">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-10 sm:mt-12 md:mt-16 text-base sm:text-lg md:text-xl text-white/50 font-bold">
            بدون تعقيد… وبدون تحميل الجمعية ما لا تحتمل
          </p>
        </div>
      </section>

      {/* Detailed Assessment Survey */}
      <section
        ref={assessmentRef.ref}
        className="py-16 sm:py-24 md:py-32 bg-white"
        id="assessment"
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          {step === "intro" && (
            <div className="text-center bg-brand-light-gold p-6 sm:p-10 md:p-20 rounded-[2rem] sm:rounded-[3rem] md:rounded-[5rem] border-4 border-brand-gold/20 relative overflow-hidden shadow-2xl">
              <div className="absolute -top-16 -left-16 sm:-top-20 sm:-left-20 w-52 h-52 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-brand-gold/10 rounded-full"></div>
              <Rocket className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 text-brand-gold mx-auto mb-6 sm:mb-8" />
              <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-brand-dark mb-6 sm:mb-8 leading-tight">
                ابدأ بناء جمعية جاهزة للأثر
              </h2>
              <p className="text-base sm:text-xl md:text-2xl text-brand-gray mb-8 sm:mb-12 md:mb-16 leading-relaxed font-medium">
                لا تبدأ بمشروع جديد… ابدأ ببناء الأساس الصحيح. قيم جاهزيتك الآن
                عبر نموذج الامتثال السنوي.
              </p>
              <div className="flex w-full max-w-3xl mx-auto flex-col md:flex-row gap-3 sm:gap-4 md:gap-5 lg:gap-6 justify-center items-stretch">
                <Button
                  onClick={handleAssessmentEntry}
                  size="lg"
                  className="bg-brand-dark text-white px-5 sm:px-8 md:px-8 lg:px-16 py-3 sm:py-4 md:py-5 lg:py-10 !h-auto min-h-12 sm:min-h-14 rounded-2xl sm:rounded-3xl text-sm sm:text-base md:text-lg lg:text-2xl font-black shadow-2xl w-full md:flex-1 lg:flex-none md:w-auto whitespace-normal leading-tight text-center"
                >
                  {hasRegistration ? "ابدأ التقييم" : "🚀 ابدأ رحلة جمعيتك الآن"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAssessmentEntry}
                  className="border-brand-dark text-brand-dark px-5 sm:px-8 md:px-5 lg:px-16 py-3 sm:py-4 md:py-5 lg:py-10 !h-auto min-h-12 sm:min-h-14 rounded-2xl sm:rounded-3xl text-sm sm:text-base md:text-lg lg:text-2xl font-black w-full md:flex-1 lg:flex-none md:w-auto whitespace-normal leading-tight text-center"
                >
                  {hasRegistration ? "ابدأ التقييم الآن" : "📋 احصل على تقييم مجاني"}
                </Button>
              </div>
            </div>
          )}

          {step === "assessment" && (
            <div className="bg-white shadow-2xl rounded-[1.75rem] sm:rounded-[2.75rem] md:rounded-[4rem] border border-brand-light overflow-hidden">
              <div className="bg-brand-dark p-5 sm:p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sm:gap-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 underline decoration-brand-gold underline-offset-8">
                    تقييم نضج المنظومة
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <span className="bg-brand-gold text-white px-4 py-1 rounded-lg text-sm font-black">
                      المحور {activeAxisIndex + 1}
                    </span>
                    <p className="text-base sm:text-lg md:text-2xl font-bold text-white/90">
                      {assessmentAxes[activeAxisIndex].title}
                    </p>
                  </div>
                </div>
                <div className="bg-white/10 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-center border border-white/10 min-w-[120px] sm:min-w-[150px] self-end md:self-auto">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-gold">
                    {Math.round(
                      ((activeAxisIndex + 1) / assessmentAxes.length) * 100,
                    )}
                    %
                  </div>
                  <p className="text-xs text-white/50 mt-2 font-bold uppercase tracking-widest">
                    نسبة التقدّم
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-8 md:p-20">
                <div className="space-y-5 sm:space-y-8 md:space-y-12">
                  {assessmentAxes[activeAxisIndex].questions.map((q, qIdx) => (
                    <div
                      key={qIdx}
                      className="p-4 sm:p-6 md:p-10 bg-brand-light-gold/30 rounded-[1.25rem] sm:rounded-[1.75rem] md:rounded-[2.5rem] border-2 border-brand-gold/5 hover:border-brand-gold/20 transition-all"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 md:mb-10 gap-4 sm:gap-6">
                        <label className="text-base sm:text-xl md:text-2xl font-black text-brand-dark leading-tight">
                          {q}
                        </label>
                        <div className="bg-brand-dark text-brand-gold w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-black shadow-xl self-end md:self-auto">
                          {responses[
                            `${assessmentAxes[activeAxisIndex].title}-${qIdx}`
                          ] || 0}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
                        <div className="text-[10px] sm:text-xs font-black text-red-500 uppercase tracking-tighter shrink-0">
                          خطر مؤسسي
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="5"
                          step="1"
                          value={
                            responses[
                              `${assessmentAxes[activeAxisIndex].title}-${qIdx}`
                            ] || 0
                          }
                          onChange={(e) =>
                            handleScoreChange(
                              assessmentAxes[activeAxisIndex].title,
                              qIdx,
                              parseInt(e.target.value),
                            )
                          }
                          className="flex-grow h-3 sm:h-4 bg-white border-2 border-brand-gold/10 rounded-full appearance-none cursor-pointer accent-brand-gold min-w-0"
                        />
                        <div className="text-[10px] sm:text-xs font-black text-green-500 uppercase tracking-tighter shrink-0">
                          امتثال مستدام
                        </div>
                      </div>
                      <div className="flex justify-between mt-3 sm:mt-4 px-1">
                        {[0, 1, 2, 3, 4, 5].map((v) => (
                          <div
                            key={v}
                            className="text-[10px] font-bold text-brand-gray/40"
                          >
                            {v}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between mt-8 sm:mt-12 md:mt-20 gap-4 sm:gap-6">
                  <Button
                    variant="outline"
                    disabled={activeAxisIndex === 0}
                    onClick={() => setActiveAxisIndex((prev) => prev - 1)}
                    className="flex-1 py-4 sm:py-6 md:py-10 rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-brand-dark text-brand-dark text-base sm:text-xl md:text-2xl font-black hover:bg-brand-dark hover:text-white transition-all"
                  >
                    المحور السابق
                  </Button>
                  {activeAxisIndex === assessmentAxes.length - 1 ? (
                    <Button
                      onClick={() => setStep("result")}
                      className="flex-[2] bg-brand-gold text-white py-4 sm:py-6 md:py-10 rounded-2xl sm:rounded-3xl text-lg sm:text-2xl md:text-3xl font-black shadow-2xl shadow-brand-gold/30"
                    >
                      إصدار التقرير النهائي 📊
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setActiveAxisIndex((prev) => prev + 1)}
                      className="flex-[2] bg-brand-dark text-white py-4 sm:py-6 md:py-10 rounded-2xl sm:rounded-3xl text-base sm:text-xl md:text-2xl font-black shadow-2xl"
                    >
                      حفظ والمتابعة للمحور التالي
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === "result" && (
            <div className="space-y-12 animate-in fade-in zoom-in duration-1000">
              <div className="bg-brand-dark text-white p-6 sm:p-10 md:p-16 rounded-[2rem] sm:rounded-[3rem] md:rounded-[5rem] text-center relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl sm:text-4xl md:text-6xl font-black mb-8 sm:mb-10 md:mb-12">
                    نتيجة تشخيص المنظومة المجتمعية
                  </h2>

                  <div className="flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-12 md:gap-16 mb-10 sm:mb-12 md:mb-16">
                    <div className="w-44 h-44 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full border-[10px] sm:border-[14px] md:border-[20px] border-brand-gold flex flex-col items-center justify-center bg-white text-brand-dark shadow-2xl transform hover:rotate-6 transition-transform">
                      <span className="text-4xl sm:text-5xl md:text-7xl font-black">
                        {getOverallAverage()}
                      </span>
                      <span className="text-xs font-black text-brand-gray uppercase tracking-widest mt-1">
                        المتوسط العام
                      </span>
                    </div>
                    <div className="text-center md:text-right w-full md:w-auto">
                      <p className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-gold mb-3 sm:mb-4">
                        مستوى النضج المؤسسي:
                      </p>
                      <h3
                        className={`text-3xl sm:text-5xl md:text-7xl font-black ${getMaturityLevel(parseFloat(getOverallAverage())).color} mb-6 sm:mb-8 leading-tight drop-shadow-md`}
                      >
                        {
                          getMaturityLevel(parseFloat(getOverallAverage()))
                            .label
                        }
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        {["ناشئة", "نامية", "ناضجة", "مستدامة"].map((stage) => (
                          <div
                            key={stage}
                            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black border-2 transition-all ${getMaturityLevel(parseFloat(getOverallAverage())).stage === stage ? "bg-brand-gold border-brand-gold text-white scale-105 shadow-lg" : "border-white/10 text-white/30"}`}
                          >
                            {stage}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {assessmentAxes.map((a, i) => (
                  <Card
                    key={i}
                    className="border-none shadow-2xl bg-white overflow-hidden rounded-[3rem] border-b-8 border-brand-gold/10"
                  >
                    <CardContent className="p-5 sm:p-7 md:p-10">
                      <div className="flex justify-between items-start mb-6">
                        <h4 className="font-black text-brand-dark text-lg sm:text-xl md:text-2xl max-w-[70%] leading-tight">
                          {a.title}
                        </h4>
                        <div
                          className={`text-2xl sm:text-3xl md:text-4xl font-black ${getMaturityLevel(parseFloat(getAxisAverage(a.title).toString())).color}`}
                        >
                          {getAxisAverage(a.title)}
                        </div>
                      </div>
                      <div className="h-6 bg-brand-light rounded-full mb-4 overflow-hidden p-1 shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${getMaturityLevel(parseFloat(getAxisAverage(a.title).toString())).color.replace("text", "bg")}`}
                          style={{
                            width: `${(parseFloat(getAxisAverage(a.title).toString()) / 5) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center text-xs font-black">
                        <span className="text-brand-gray/50 uppercase">
                          درجة النضج
                        </span>
                        <span
                          className={
                            getMaturityLevel(
                              parseFloat(getAxisAverage(a.title).toString()),
                            ).color
                          }
                        >
                          {
                            getMaturityLevel(
                              parseFloat(getAxisAverage(a.title).toString()),
                            ).label
                          }
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-brand-light-gold p-6 sm:p-10 md:p-16 rounded-[2rem] sm:rounded-[3rem] md:rounded-[5rem] border-4 border-brand-gold/20 text-center shadow-xl">
                <HelpCircle className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-brand-gold mx-auto mb-6 sm:mb-8" />
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-6 sm:mb-8 text-brand-dark">
                  خطة المعالجة الفورية
                </h3>
                <p className="text-base sm:text-xl md:text-2xl text-brand-gray mb-8 sm:mb-10 md:mb-12 leading-relaxed max-w-4xl mx-auto font-medium">
                  وجد نظامنا التحليلي أن المحور الأكثر حرجاً لديك هو{" "}
                  <span className="font-black text-brand-dark underline decoration-brand-gold decoration-4 underline-offset-8">
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
                  . نوصي بالبدء في رحلة التحول فوراً.
                </p>
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-brand-dark text-white px-6 sm:px-10 md:px-16 py-4 sm:py-6 md:py-10 rounded-2xl sm:rounded-3xl text-base sm:text-xl md:text-2xl font-black shadow-2xl hover:scale-105 transition-transform w-full md:w-auto"
                  >
                    <a
                      href={recommendation.link}
                      target={recommendation.external ? "_blank" : undefined}
                      rel={
                        recommendation.external
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {recommendation.cta}
                    </a>
                  </Button>
                  <Button
                    onClick={() => {
                      setStep("intro");
                      setActiveAxisIndex(0);
                      setResponses({});
                    }}
                    variant="outline"
                    className="border-brand-dark text-brand-dark px-6 sm:px-10 md:px-16 py-4 sm:py-6 md:py-10 rounded-2xl sm:rounded-3xl text-base sm:text-xl md:text-2xl font-black w-full md:w-auto"
                  >
                    إعادة التشخيص الشامل
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Community Engagement Sub-Module */}
      <section className="py-14 sm:py-20 md:py-24 lg:py-32 bg-brand-light relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 items-start gap-8 sm:gap-10 md:gap-12 lg:gap-16">
            <div className="text-center lg:text-right">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-brand-dark mb-4 sm:mb-6 md:mb-7 leading-tight">
                منصة تفاعلية للمشاركة المجتمعية
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-brand-gray leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
                نؤمن أن التحول الحقيقي يبدأ بتمكين المجتمع المحلي من المشاركة في
                صنع القرار.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <div className="bg-white p-4 sm:p-5 md:p-6 lg:p-7 rounded-[1.25rem] sm:rounded-[1.75rem] md:rounded-[2.25rem] shadow-xl border-b-8 border-blue-500/20 h-full min-h-[220px] flex flex-col">
                <ThumbsUp className="text-blue-500 mb-4 sm:mb-5" size={32} />
                <h4 className="text-lg sm:text-xl md:text-2xl font-black mb-2 sm:mb-3 text-brand-dark leading-snug">
                  نظام التصويت
                </h4>
                <p className="text-brand-gray text-sm sm:text-base leading-relaxed mt-auto">
                  أدوات تتيح للمجتمع التصويت على المبادرات المحلية ذات الأولوية.
                </p>
              </div>
              <div className="bg-white p-4 sm:p-5 md:p-6 lg:p-7 rounded-[1.25rem] sm:rounded-[1.75rem] md:rounded-[2.25rem] shadow-xl border-b-8 border-purple-500/20 h-full min-h-[220px] flex flex-col">
                <MessageSquare
                  className="text-purple-500 mb-4 sm:mb-5"
                  size={32}
                />
                <h4 className="text-lg sm:text-xl md:text-2xl font-black mb-2 sm:mb-3 text-brand-dark leading-snug">
                  بنك المقترحات
                </h4>
                <p className="text-brand-gray text-sm sm:text-base leading-relaxed mt-auto">
                  واجهة تفاعلية لاستقبال تعليقات واقتراحات المستفيدين وأصحاب
                  المصلحة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
