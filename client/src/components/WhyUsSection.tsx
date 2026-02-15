import { ShieldCheck, Layers, BarChart3, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const reasons = [
  {
    icon: ShieldCheck,
    title: "خبرة موثوقة في القطاع الاجتماعي",
    desc: "عملنا مع أكثر من 645 جمعية ومنظمة غير ربحية على مستوى المملكة، حيث قمنا بتطوير استراتيجيات وحلول مبتكرة ساعدت في تحقيق رؤية المملكة 2030.",
    color: "bg-brand-gold/15 text-brand-gold-dark",
  },
  {
    icon: Layers,
    title: "حلول شاملة ومتكاملة",
    desc: "سواء كنت بحاجة إلى استشارات استراتيجية، حلول رقمية مبتكرة، أو دورات تدريبية، نحن نقدم لك الأدوات اللازمة لتحقيق التغيير الفعلي.",
    color: "bg-brand-gold/15 text-brand-gold-dark",
  },
  {
    icon: BarChart3,
    title: "قياس الأثر ونتائج المشاريع",
    desc: "نساعدك على مراقبة وتحليل الأداء عبر منصات متكاملة، لضمان تحقيق الأهداف الاجتماعية وتحقيق أثر ملموس.",
    color: "bg-brand-gold/15 text-brand-gold-dark",
  },
];

const steps = [
  { num: "1", title: "تحليل احتياجاتكم", desc: "نفهم رؤيتكم ونقيّم وضعكم الحالي بدقة لتحديد الأولويات" },
  { num: "2", title: "تخطيط استراتيجي مدروس", desc: "نُصمم حلولًا مبتكرة ومخصصة تستند إلى أفضل الممارسات" },
  { num: "3", title: "تنفيذ احترافي", desc: "نلتزم بمعايير الجودة والجدول الزمني لضمان إنجاز المشاريع بكفاءة" },
  { num: "4", title: "متابعة الأداء", desc: "نقيس النتائج ونقدم توصيات مستمرة للتحسين والتطوير" },
  { num: "5", title: "شراكة مستدامة", desc: "نبني علاقات طويلة الأمد توفر دعمًا مستمرًا لتحقيق النجاح" },
];

const guarantees = [
  { title: "تحسين الأداء بضمان واضح", desc: "تحسين أداء مؤسستك بنسبة تتراوح بين 30% إلى 70% حسب نوع الخدمة المقدمة" },
  { title: "شفافية تامة وتحكم كامل", desc: "تمتلك مؤسستك جميع الأنظمة والأدلة الإجرائية والخطط التي يتم تصميمها" },
  { title: "فريق خبراء متخصص", desc: "فريقنا يتمتع بخبرة واسعة في دعم المنظمات غير الربحية وتحقيق أهدافها" },
  { title: "ضمان النتائج", desc: "إذا لم نحقق التحسين الموعود، يمكنك استرداد استثمارك بالكامل" },
];

export function WhyUsSection() {
  const header = useScrollAnimation();
  const reasonsAnim = useScrollAnimation();
  const guaranteesAnim = useScrollAnimation();
  const stepsAnim = useScrollAnimation();

  return (
    <section id="why-us" className="py-24 bg-brand-light">
      <div className="container mx-auto px-4">
        <div ref={header.ref} className={`text-center mb-16 scroll-hidden ${header.isVisible ? "scroll-visible" : ""}`}>
          <span className="font-almarai text-sm font-bold text-brand-gold-dark bg-brand-gold/10 px-4 py-1.5 rounded-md" data-testid="badge-why-us">
            لماذا تختارنا
          </span>
          <h2 className="font-almarai font-extrabold text-3xl md:text-4xl text-brand-dark mt-6 mb-4" data-testid="text-why-us-title">
            نتائج مضمونة وأداء متميز
          </h2>
        </div>

        <div ref={reasonsAnim.ref} className="grid md:grid-cols-3 gap-6 mb-20">
          {reasons.map((r, i) => (
            <div
              key={r.title}
              className={`bg-white rounded-md p-8 border border-gray-100 hover:shadow-md transition-shadow scroll-hidden stagger-${i + 1} ${reasonsAnim.isVisible ? "scroll-visible" : ""}`}
              data-testid={`reason-${r.title}`}
            >
              <div className={`w-14 h-14 rounded-md flex items-center justify-center mb-5 ${r.color}`}>
                <r.icon size={26} />
              </div>
              <h4 className="font-almarai font-bold text-xl text-brand-dark mb-3">{r.title}</h4>
              <p className="font-almarai text-brand-gray leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>

        <div ref={guaranteesAnim.ref} className={`bg-brand-dark rounded-md p-8 md:p-12 mb-20 scroll-hidden ${guaranteesAnim.isVisible ? "scroll-visible" : ""}`}>
          <div className="text-center mb-10">
            <h3 className="font-almarai font-extrabold text-2xl md:text-3xl text-white mb-3">التزامنا نحو مؤسستك</h3>
            <p className="font-almarai text-white/60">نعم مضمون! تحسين أداء مؤسستك بشكل ملحوظ</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {guarantees.map((g) => (
              <div key={g.title} className="flex items-start gap-3" data-testid={`guarantee-${g.title}`}>
                <CheckCircle2 size={20} className="text-brand-gold mt-1 shrink-0" />
                <div>
                  <h4 className="font-almarai font-bold text-white mb-1">{g.title}</h4>
                  <p className="font-almarai text-white/60 text-sm leading-relaxed">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild size="lg" className="bg-brand-gold text-white font-almarai rounded-lg px-8 font-bold gap-2">
              <a href="#contact" data-testid="button-guarantee-cta">
                احتاج لمساعدتكم
                <ArrowLeft size={18} />
              </a>
            </Button>
          </div>
        </div>

        <div ref={stepsAnim.ref} className={`text-center mb-12 scroll-hidden ${stepsAnim.isVisible ? "scroll-visible" : ""}`}>
          <span className="font-almarai text-sm font-bold text-brand-gold-dark bg-brand-gold/15 px-4 py-1.5 rounded-md">
            كيف نعمل
          </span>
          <h2 className="font-almarai font-extrabold text-3xl md:text-4xl text-brand-dark mt-6 mb-4" data-testid="text-how-we-work-title">
            استراتيجيتنا في تقديم الخدمة
          </h2>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 right-0 left-0 h-0.5 bg-brand-gold/20 -translate-y-1/2" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`relative scroll-hidden stagger-${i + 1} ${stepsAnim.isVisible ? "scroll-visible" : ""}`}
                data-testid={`step-${step.num}`}
              >
                <div className="bg-white rounded-md p-6 border border-gray-100 h-full hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-brand-gold rounded-md flex items-center justify-center mb-4">
                    <span className="font-almarai font-extrabold text-white text-lg">{step.num}</span>
                  </div>
                  <h4 className="font-almarai font-bold text-brand-dark mb-2">{step.title}</h4>
                  <p className="font-almarai text-brand-gray text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
