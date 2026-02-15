import { useState } from "react";
import {
  FileText, Settings, Award, DollarSign, BarChart3,
  Heart, BookOpen, Palette, ChevronDown
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const serviceCategories = [
  {
    id: "plans",
    title: "إعداد وتصميم الخطط",
    icon: FileText,
    color: "bg-brand-gold/15 text-brand-gold-dark",
    accentBorder: "border-brand-gold/20",
    services: [
      { title: "الخطط الاستراتيجية", desc: "تطوير رؤى واضحة لتحقيق الأهداف طويلة المدى." },
      { title: "الخطط السنوية", desc: "تنظيم العمليات لضمان تنفيذ فعّال على مدار العام." },
      { title: "الخطط التسويقية", desc: "وضع استراتيجيات متكاملة لزيادة التأثير والوصول للجمهور المستهدف." },
      { title: "خطط الاتصال", desc: "تحسين قنوات التواصل الداخلي والخارجي." },
      { title: "خطط الاستدامة المالية", desc: "تصميم حلول مبتكرة لتحقيق الاستقرار المالي." },
      { title: "خطط الإعلام", desc: "إنشاء استراتيجيات إعلامية تبرز رسالة المؤسسة." },
    ],
  },
  {
    id: "initiatives",
    title: "تصميم المبادرات والحملات",
    icon: Heart,
    color: "bg-brand-gold/15 text-brand-gold-dark",
    accentBorder: "border-brand-gold/20",
    services: [
      { title: "المبادرات المجتمعية", desc: "تطوير أفكار مبتكرة تخدم المجتمع وتعزز دور المؤسسة." },
      { title: "الحملات التسويقية", desc: "تنفيذ حملات إبداعية تحقق أهدافك الترويجية." },
    ],
  },
  {
    id: "guides",
    title: "إعداد الأدلة والتقارير",
    icon: BookOpen,
    color: "bg-brand-gold/15 text-brand-gold-dark",
    accentBorder: "border-brand-gold/20",
    services: [
      { title: "الأدلة الإجرائية", desc: "تنظيم العمليات المؤسسية عبر توثيقها في أدلة شاملة." },
      { title: "التقارير السنوية", desc: "إبراز إنجازات المؤسسة بأسلوب احترافي." },
      { title: "دليل البرامج", desc: "توثيق وإدارة البرامج والمبادرات بفعالية." },
    ],
  },
  {
    id: "media",
    title: "تعزيز الهوية البصرية والإعلام الرقمي",
    icon: Palette,
    color: "bg-brand-gold/15 text-brand-gold-dark",
    accentBorder: "border-brand-gold/20",
    services: [
      { title: "تصميم الهوية البصرية", desc: "إنشاء هوية مميزة تعكس قيم المؤسسة وأهدافها." },
      { title: "فيديوهات موشن جرافيك", desc: "تصميم مقاطع مرئية مبتكرة تجذب الجمهور." },
      { title: "المواقع الإلكترونية", desc: "تطوير مواقع إلكترونية متكاملة تعكس احترافية المؤسسة." },
      { title: "المتاجر الإلكترونية", desc: "إنشاء منصات تفاعلية تدعم أهداف المؤسسة التجارية أو الخدمية." },
    ],
  },
];

export function ServicesSection() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("plans");
  const header = useScrollAnimation();
  const accordion = useScrollAnimation();
  const counters = useScrollAnimation();

  return (
    <section id="services" className="py-24 bg-brand-light">
      <div className="container mx-auto px-4">
        <div ref={header.ref} className={`text-center mb-16 scroll-hidden ${header.isVisible ? "scroll-visible" : ""}`}>
          <span className="font-almarai text-sm font-bold text-brand-gold-dark bg-brand-gold/15 px-4 py-1.5 rounded-md" data-testid="badge-services">
            خدماتنا
          </span>
          <h2 className="font-almarai font-extrabold text-3xl md:text-4xl text-brand-dark mt-6 mb-4" data-testid="text-services-title">
            ما نقدمه لشركائنا في التغيير
          </h2>
          <p className="font-almarai text-brand-gray max-w-2xl mx-auto text-lg">
            حلول شاملة ومتكاملة تلبي احتياجات مؤسستك التشغيلية والإبداعية
          </p>
        </div>

        <div ref={accordion.ref} className="space-y-4 max-w-4xl mx-auto">
          {serviceCategories.map((cat, i) => (
            <div
              key={cat.id}
              className={`bg-white rounded-md border ${expandedCategory === cat.id ? cat.accentBorder : "border-gray-100"} transition-all scroll-hidden stagger-${i + 1} ${accordion.isVisible ? "scroll-visible" : ""}`}
            >
              <button
                onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                className="w-full flex items-center justify-between gap-4 p-5"
                data-testid={`button-service-category-${cat.id}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-md flex items-center justify-center shrink-0 ${cat.color}`}>
                    <cat.icon size={20} />
                  </div>
                  <span className="font-almarai font-bold text-lg text-brand-dark text-right">{cat.title}</span>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-brand-gray shrink-0 transition-transform ${expandedCategory === cat.id ? "rotate-180" : ""}`}
                />
              </button>
              {expandedCategory === cat.id && (
                <div className="px-5 pb-5 grid sm:grid-cols-2 gap-4 animate-fade-up">
                  {cat.services.map((s) => (
                    <div key={s.title} className="p-4 rounded-md bg-gray-50/70 border border-gray-100" data-testid={`service-${s.title}`}>
                      <h4 className="font-almarai font-bold text-brand-dark mb-1.5">{s.title}</h4>
                      <p className="font-almarai text-sm text-brand-gray leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div ref={counters.ref} className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: DollarSign, value: "15+", label: "خطة تنمية موارد مالية" },
            { icon: FileText, value: "80+", label: "خطة سنوية" },
            { icon: BarChart3, value: "65+", label: "استراتيجية" },
            { icon: Settings, value: "30+", label: "بناء مؤسسي" },
          ].map((item, i) => (
            <div
              key={item.label}
              className={`text-center p-6 bg-white rounded-md border border-gray-100 scroll-hidden stagger-${i + 1} ${counters.isVisible ? "scroll-visible" : ""}`}
              data-testid={`counter-${item.label}`}
            >
              <div className="w-12 h-12 bg-brand-gold/15 rounded-md flex items-center justify-center mx-auto mb-3">
                <item.icon size={22} className="text-brand-gold-dark" />
              </div>
              <p className="font-almarai font-extrabold text-3xl text-brand-dark">{item.value}</p>
              <p className="font-almarai text-sm text-brand-gray mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
