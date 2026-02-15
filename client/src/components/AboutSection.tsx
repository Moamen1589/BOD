import { Eye, Target, Gem, Handshake, Lightbulb, ShieldCheck } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const values = [
  { icon: ShieldCheck, label: "احترافية", desc: "في التنفيذ", color: "bg-brand-gold/15 text-brand-gold-dark" },
  { icon: Lightbulb, label: "إبداع", desc: "في الحلول", color: "bg-brand-gold/15 text-brand-gold-dark" },
  { icon: Gem, label: "التزام", desc: "بالجودة والمواعيد", color: "bg-brand-gold/15 text-brand-gold-dark" },
  { icon: Handshake, label: "شراكة فاعلة", desc: "لنجاح مستدام", color: "bg-brand-gold/15 text-brand-gold-dark" },
];

export function AboutSection() {
  const header = useScrollAnimation();
  const cards = useScrollAnimation();
  const valuesAnim = useScrollAnimation();

  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div ref={header.ref} className={`text-center mb-16 scroll-hidden ${header.isVisible ? "scroll-visible" : ""}`}>
          <span className="font-almarai text-sm font-bold text-brand-gold-dark bg-brand-gold/10 px-4 py-1.5 rounded-md" data-testid="badge-about">
            من نحن
          </span>
          <h2 className="font-almarai font-extrabold text-3xl md:text-4xl text-brand-dark mt-6 mb-4" data-testid="text-about-title">
            شركة ولادة حلم للاستشارات والأبحاث
          </h2>
          <p className="font-almarai text-brand-gray max-w-3xl mx-auto text-lg leading-relaxed">
            شركة استشارية متخصصة في تمكين المنظمات غير الربحية عبر حلول استراتيجية مبتكرة واستشارات مهنية. منذ تأسيسنا في عام 2017، فريقنا يمتلك خبرة أكثر من 13 عامًا في مجالات استشارية متنوعة تشمل الإدارة، الإعلام، المالية، والتقنية.
          </p>
        </div>

        <div ref={cards.ref} className="grid md:grid-cols-2 gap-8 mb-20">
          <div className={`bg-gradient-to-br from-brand-light-gold to-white rounded-md p-8 border border-brand-gold/15 scroll-hidden stagger-1 ${cards.isVisible ? "scroll-visible" : ""}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-brand-gold/15 rounded-md flex items-center justify-center">
                <Eye size={22} className="text-brand-gold-dark" />
              </div>
              <h3 className="font-almarai font-extrabold text-xl text-brand-dark">الرؤية</h3>
            </div>
            <p className="font-almarai text-brand-dark/70 text-lg leading-relaxed" data-testid="text-vision">
              أن نكون الحاضن الأول للقطاع الثالث
            </p>
          </div>

          <div className={`bg-gradient-to-br from-brand-light-gold to-white rounded-md p-8 border border-brand-gold/15 scroll-hidden stagger-2 ${cards.isVisible ? "scroll-visible" : ""}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-brand-gold/15 rounded-md flex items-center justify-center">
                <Target size={22} className="text-brand-gold-dark" />
              </div>
              <h3 className="font-almarai font-extrabold text-xl text-brand-dark">الرسالة</h3>
            </div>
            <p className="font-almarai text-brand-dark/70 leading-relaxed mb-4">
              تقديم خدمات التطوير للقطاع غير الربحي في:
            </p>
            <ul className="font-almarai text-brand-dark/60 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-brand-gold rounded-full shrink-0" />
                أربع مجالات أساسية (الإداري - الإعلامي - المالي - التقني)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-brand-gold rounded-full shrink-0" />
                الأداء الاستراتيجي والبناء المؤسسي
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-brand-gold rounded-full shrink-0" />
                تأهيل المنظمات لجوائز التميز
              </li>
            </ul>
          </div>
        </div>

        <div ref={valuesAnim.ref} className={`text-center mb-8 scroll-hidden ${valuesAnim.isVisible ? "scroll-visible" : ""}`}>
          <h3 className="font-almarai font-extrabold text-2xl text-brand-dark">قيمنا</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div
              key={v.label}
              className={`text-center p-6 bg-white rounded-md border border-gray-100 hover:shadow-md transition-shadow scroll-hidden stagger-${i + 1} ${valuesAnim.isVisible ? "scroll-visible" : ""}`}
              data-testid={`value-${v.label}`}
            >
              <div className={`w-14 h-14 rounded-md flex items-center justify-center mx-auto mb-4 ${v.color}`}>
                <v.icon size={26} />
              </div>
              <h4 className="font-almarai font-bold text-lg text-brand-dark mb-1">{v.label}</h4>
              <p className="font-almarai text-sm text-brand-gray">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
