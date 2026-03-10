import { useState } from "react";
import {
  FileText, Settings, DollarSign, BarChart3,
  Heart, BookOpen, Palette, ChevronDown
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const serviceCategories = [
  {
    id: "plans",
    title: "إعداد وتصميم الخطط",
    icon: FileText,
    services: [
      { title: "الخطط الاستراتيجية", desc: "تطوير رؤى واضحة لتحقيق الأهداف طويلة المدى." },
      { title: "الخطط السنوية", desc: "تنظيم العمليات لضمان تنفيذ فعّال على مدار العام." },
      { title: "الخطط التسويقية", desc: "وضع استراتيجيات متكاملة لزيادة التأثير والوصول للجمهور." },
    ],
  },
  {
    id: "initiatives",
    title: "تصميم المبادرات والحملات",
    icon: Heart,
    services: [
      { title: "المبادرات المجتمعية", desc: "تصميم مبادرات تخدم المجتمع وتعزز دور المؤسسة." },
      { title: "الحملات التسويقية", desc: "تنفيذ حملات إبداعية تحقق الأهداف الترويجية." },
    ],
  },
  {
    id: "guides",
    title: "إعداد الأدلة والتقارير",
    icon: BookOpen,
    services: [
      { title: "الأدلة الإجرائية", desc: "توثيق العمليات في أدلة شاملة وسهلة التطبيق." },
      { title: "التقارير السنوية", desc: "عرض الإنجازات بأسلوب احترافي ومقنع." },
      { title: "دليل البرامج", desc: "تنظيم إدارة البرامج والمبادرات بفعالية." },
    ],
  },
  {
    id: "media",
    title: "الهوية البصرية والإعلام الرقمي",
    icon: Palette,
    services: [
      { title: "تصميم الهوية البصرية", desc: "هوية مميزة تعكس قيم المؤسسة." },
      { title: "فيديوهات موشن جرافيك", desc: "محتوى مرئي جذاب برسائل واضحة." },
      { title: "المواقع الإلكترونية", desc: "مواقع احترافية تعكس حضور المؤسسة." },
    ],
  },
];

export function ServicesSection() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("plans");
  const header = useScrollAnimation();
  const accordion = useScrollAnimation();
  const counters = useScrollAnimation();

  return (
    <section id="services" className="py-16 md:py-24 bg-brand-light">
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
          {serviceCategories.map((cat, i) => {
            const isOpen = expandedCategory === cat.id;
            return (
              <div
                key={cat.id}
                className={`rounded-md border transition-all scroll-hidden stagger-${i + 1} ${accordion.isVisible ? "scroll-visible" : ""} ${isOpen ? "border-brand-gold/40 shadow-md" : "border-gray-100 bg-white"}`}
              >
                <button
                  onClick={() => setExpandedCategory(isOpen ? null : cat.id)}
                  className={`w-full flex items-center justify-between gap-4 p-5 rounded-md transition-colors ${isOpen ? "bg-brand-gold text-white" : "bg-white text-brand-dark"}`}
                  data-testid={`button-service-category-${cat.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-md flex items-center justify-center shrink-0 ${isOpen ? "bg-white/20 text-white" : "bg-brand-gold/15 text-brand-gold-dark"}`}>
                      <cat.icon size={20} />
                    </div>
                    <span className="font-almarai font-bold text-lg text-right">{cat.title}</span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 transition-transform ${isOpen ? "rotate-180 text-white" : "text-brand-gray"}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-4 grid sm:grid-cols-2 gap-4 animate-fade-up bg-white">
                    {cat.services.map((s) => (
                      <div key={s.title} className="p-4 rounded-md bg-gray-50 border border-gray-100" data-testid={`service-${s.title}`}>
                        <h4 className="font-almarai font-bold text-brand-dark mb-1.5">{s.title}</h4>
                        <p className="font-almarai text-sm text-brand-gray leading-relaxed">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
