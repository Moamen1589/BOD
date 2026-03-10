import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type Solution = {
  title: string;
  desc: string;
  link?: string;
  available: boolean;
  logoUrl?: string;
  logoText?: string;
};

const solutions: Solution[] = [
  {
    title: "منصة أداء لقياس الأداء المؤسسي",
    desc: "منصة لقياس أداء المنظمات وتحليل نتائج المشاريع بشكل دقيق.",
    link: "https://adaa.pro",
    logoUrl: "https://www.google.com/s2/favicons?domain=adaa.pro&sz=128",
    available: true,
  },
  {
    title: "مختبرات حقّق الاجتماعية",
    desc: "منصة تقدم استشارات تخصصية ودراسات ميدانية للمشاريع الاجتماعية.",
    link: "https://haqqeq-lab.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=haqqeq-lab.com&sz=128",
    available: true,
  },
  {
    title: "مسرعة أثر وريادة",
    desc: "منصة لتصميم الخطط الاستراتيجية والتشغيلية ومتابعة الأداء.",
    link: "https://athar-riyada.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=athar-riyada.com&sz=128",
    available: true,
  },
  {
    title: "أكاديمية حقّق 360",
    desc: "منصة تدريبية تجمع بين الاستشارات والتدريب المؤسسي.",
    link: "https://www.hqq360.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=hqq360.com&sz=128",
    available: true,
  },
  {
    title: "أثر 360",
    desc: "منصة لقياس الأثر التسويقي وتحليل نتائج الحملات التسويقية.",
    available: false,
    logoText: "A360",
  },
  {
    title: "منصة عباق",
    desc: "منصة تفاعلية تدعم التحول المؤسسي وتربط بين التشغيل وقياس الأثر.",
    available: false,
    logoText: "عباق",
  },
];

function PlatformLogo({ solution }: { solution: Solution }) {
  if (solution.logoUrl) {
    return (
      <img
        src={solution.logoUrl}
        alt={solution.title}
        className="w-8 h-8 object-contain"
        loading="lazy"
      />
    );
  }

  return (
    <span className="font-almarai font-extrabold text-sm text-brand-gold-dark">
      {solution.logoText}
    </span>
  );
}

export function SolutionsSection() {
  const header = useScrollAnimation();
  const grid = useScrollAnimation();

  return (
    <section id="solutions" className="py-16 md:py-24 bg-white">
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
              className={`relative rounded-md p-6 bg-brand-gold/10 border border-gray-100 hover:shadow-md transition-shadow scroll-hidden stagger-${i + 1} ${grid.isVisible ? "scroll-visible" : ""}`}
              data-testid={`solution-card-${s.title}`}
            >
              {!s.available && (
                <span className="absolute top-4 left-4 font-almarai text-xs font-bold bg-brand-gold text-white px-3 py-1 rounded-md" data-testid="badge-coming-soon">
                  قريبًا
                </span>
              )}
              <div className="w-12 h-12 rounded-md flex items-center justify-center mb-4 bg-brand-gold/20">
                <PlatformLogo solution={s} />
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
