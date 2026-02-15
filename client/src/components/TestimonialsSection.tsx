import { Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  {
    text: "لقد ساعدتنا خدماتهم في تحويل استراتيجياتنا إلى واقع ملموس. فريق عمل محترف واستشاريون ذوي خبرة عالية.",
    label: "شركاء موثوقون في النجاح",
  },
  {
    text: "أداء الفريق كان متميزًا، ونتائج المشروع تسير وفق الجداول الزمنية المتفق عليها، مع ضمان أعلى معايير الجودة.",
    label: "احترافية في التنفيذ",
  },
  {
    text: "تصاميم الفيديوهات والهوية البصرية كانت رائعة، وقد ساعدتنا في تعزيز تواجدنا الرقمي ورفع مستوى الوعي حول مؤسستنا.",
    label: "محتوى مبدع يعكس هويتنا",
  },
  {
    text: "شعرنا بأنهم شركاء حقيقيون في نجاحنا. كان هناك تفاعل مستمر وتواصل فعال لتحقيق أفضل النتائج.",
    label: "شراكة حقيقية، ليس مجرد خدمة",
  },
  {
    text: "الخطط التي أعدوها كانت شاملة ومناسبة لاحتياجاتنا. استطاعوا تحسين أداء مؤسستنا بشكل كبير في وقت قياسي.",
    label: "نتائج تتجاوز التوقعات",
  },
  {
    text: "تمكنوا من تصميم حلول مالية مبتكرة جعلت مؤسستنا أكثر استقرارًا ماليًا. لم نتوقع هذا النجاح المستمر.",
    label: "دعم مستمر وتحقيق استدامة",
  },
];

export function TestimonialsSection() {
  const header = useScrollAnimation();
  const grid = useScrollAnimation();

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div ref={header.ref} className={`text-center mb-16 scroll-hidden ${header.isVisible ? "scroll-visible" : ""}`}>
          <span className="font-almarai text-sm font-bold text-brand-gold-dark bg-brand-gold/15 px-4 py-1.5 rounded-md" data-testid="badge-testimonials">
            عملائنا
          </span>
          <h2 className="font-almarai font-extrabold text-3xl md:text-4xl text-brand-dark mt-6 mb-4" data-testid="text-testimonials-title">
            ما يقوله عملائنا
          </h2>
          <p className="font-almarai text-brand-gray max-w-2xl mx-auto text-lg">
            نحن نعتز بآراء عملائنا ونستمر في العمل لتجاوز توقعاتهم
          </p>
        </div>

        <div ref={grid.ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`rounded-md p-6 border border-gray-100 hover:shadow-md transition-shadow scroll-hidden stagger-${i + 1} ${grid.isVisible ? "scroll-visible" : ""} bg-brand-light-gold/30`}
              data-testid={`testimonial-card-${i}`}
            >
              <Quote size={28} className="mb-4 text-brand-gold/40" />
              <h4 className="font-almarai font-bold text-brand-dark mb-3">{t.label}</h4>
              <p className="font-almarai text-brand-dark/70 leading-relaxed text-sm">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
