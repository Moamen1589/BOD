import { ExternalLink, BarChart3, FlaskConical, Rocket, GraduationCap, Brain, MonitorSmartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const solutions = [
  {
    icon: BarChart3,
    title: 'منصة "أداء" لقياس الأداء المؤسسي',
    desc: "منصة مبتكرة لقياس أداء المنظمات وتحليل نتائج المشاريع بشكل دقيق باستخدام أدوات متقدمة. تشمل التقييم ومنح الشهادات ودرع أداء.",
    link: "https://adaa.pro",
    color: "bg-brand-gold/10",
    iconColor: "text-brand-gold-dark bg-brand-gold/20",
    available: true,
  },
  {
    icon: FlaskConical,
    title: "مختبرات حقّق الاجتماعية",
    desc: "منصة تقدم استشارات تخصصية ودراسات ميدانية للمشاريع الاجتماعية باستخدام منهجية ميل دي برو.",
    link: "https://haqqeq-lab.com",
    color: "bg-brand-gold/10",
    iconColor: "text-brand-gold-dark bg-brand-gold/20",
    available: true,
  },
  {
    icon: Rocket,
    title: "مسرعة أثر وريادة",
    desc: "منصة لتصميم الخطط الاستراتيجية والتشغيلية ومتابعة الأداء عبر تقارير تقييمية.",
    link: "https://athar-riyada.com",
    color: "bg-brand-gold/10",
    iconColor: "text-brand-gold-dark bg-brand-gold/20",
    available: true,
  },
  {
    icon: GraduationCap,
    title: "أكاديمية حقّق 360",
    desc: "منصة تدريبية تدمج بين الاستشارات والتدريب المؤسسي عبر دورات تدريبية وورش عمل موجهة إلى المنظمات غير الربحية.",
    color: "bg-brand-gold/10",
    iconColor: "text-brand-gold-dark bg-brand-gold/20",
    available: true,
  },
  {
    icon: Brain,
    title: "أثر 360",
    desc: "منصة لقياس الأثر التسويقي وتحليل نتائج الحملات التسويقية باستخدام الذكاء الاصطناعي.",
    color: "bg-brand-gold/10",
    iconColor: "text-brand-gold-dark bg-brand-gold/20",
    available: false,
  },
  {
    icon: MonitorSmartphone,
    title: 'منصة "إسهام"',
    desc: "منصة تفاعلية تهدف إلى زيادة الشفافية بين الجمعيات والجهات المانحة، مما يسهل تقديم التبرعات وتتبعها.",
    color: "bg-brand-gold/10",
    iconColor: "text-brand-gold-dark bg-brand-gold/20",
    available: false,
  },
];

export function SolutionsSection() {
  const header = useScrollAnimation();
  const grid = useScrollAnimation();

  return (
    <section id="solutions" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div ref={header.ref} className={`text-center mb-16 scroll-hidden ${header.isVisible ? "scroll-visible" : ""}`}>
          <span className="font-almarai text-sm font-bold text-brand-gold-dark bg-brand-gold/10 px-4 py-1.5 rounded-md" data-testid="badge-solutions">
            الحلول الرقمية
          </span>
          <h2 className="font-almarai font-extrabold text-3xl md:text-4xl text-brand-dark mt-6 mb-4" data-testid="text-solutions-title">
            الحلول الرقمية المتكاملة
          </h2>
          <p className="font-almarai text-brand-gray max-w-2xl mx-auto text-lg">
            منصات وأدوات رقمية مبتكرة لدعم المنظمات غير الربحية
          </p>
        </div>

        <div ref={grid.ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((s, i) => (
            <div
              key={s.title}
              className={`relative rounded-md p-6 ${s.color} border border-gray-100 hover:shadow-md transition-shadow scroll-hidden stagger-${i + 1} ${grid.isVisible ? "scroll-visible" : ""}`}
              data-testid={`solution-card-${s.title}`}
            >
              {!s.available && (
                <span className="absolute top-4 left-4 font-almarai text-xs font-bold bg-brand-gold text-white px-3 py-1 rounded-md" data-testid="badge-coming-soon">
                  قريبًا
                </span>
              )}
              <div className={`w-12 h-12 rounded-md flex items-center justify-center mb-4 ${s.iconColor}`}>
                <s.icon size={22} />
              </div>
              <h4 className="font-almarai font-bold text-lg text-brand-dark mb-2">{s.title}</h4>
              <p className="font-almarai text-brand-gray text-sm leading-relaxed mb-4">{s.desc}</p>
              {s.available && s.link && (
                <Button asChild variant="ghost" size="sm" className="font-almarai text-brand-gold-dark p-0 h-auto gap-1">
                  <a href={s.link} target="_blank" rel="noopener noreferrer" data-testid={`link-solution-${s.title}`}>
                    زيارة المنصة
                    <ExternalLink size={14} />
                  </a>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
