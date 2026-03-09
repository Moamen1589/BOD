import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Award, Briefcase, Star } from "lucide-react";

const stats = [
  { icon: Users, value: "+645", label: "جمعية ومنظمة", color: "bg-brand-gold/20 text-brand-gold-dark" },
  { icon: Award, value: "+13", label: "سنة خبرة", color: "bg-brand-gold/20 text-brand-gold-dark" },
  { icon: Briefcase, value: "+500", label: "مشروع منجز", color: "bg-brand-gold/20 text-brand-gold-dark" },
];

const heroBackgrounds = [
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
];

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-24">
      <div className="absolute inset-0">
        {heroBackgrounds.map((image, index) => (
          <div
            key={image}
            className="absolute inset-0 bg-cover bg-center opacity-0 animate-hero-cycle"
            style={{
              backgroundImage: `url(${image})`,
              animationDelay: `${index * 6}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-brand-dark/70" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white px-5 py-2.5 rounded-md text-sm font-almarai font-bold mb-8 animate-fade-up backdrop-blur-sm border border-white/20">
            <Star size={16} className="text-brand-gold" />
            الحاضن الأول للقطاع غير الربحي
          </div>

          <h1
            className="font-almarai font-extrabold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
            data-testid="text-hero-title"
          >
            نبتكر حلولًا وخدمات فريدة
            <br />
            <span className="text-brand-gold">تتناسب مع احتياجات شركائنا</span>
          </h1>

          <p
            className="font-almarai text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.2s" }}
            data-testid="text-hero-subtitle"
          >
            نوفر الأدوات الداعمة لتحقيق الأهداف لنكون الحاضن الأول للقطاع غير الربحي في المملكة العربية السعودية
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button asChild size="lg" className="bg-brand-gold text-white font-almarai rounded-lg px-8 text-base gap-2 font-bold hover:bg-brand-gold-dark">
              <a href="#contact" data-testid="button-hero-cta">
                تواصل معنا
                <ArrowLeft size={18} />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-md px-8 text-base font-almarai border-white/40 text-white bg-white/5 hover:bg-white/10 hover:text-white">
              <a href="#about" data-testid="button-hero-about">تعرف علينا</a>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {stats.map((s) => (
              <div key={s.label} className="text-center" data-testid={`stat-${s.label}`}>
                <div className={`flex items-center justify-center w-12 h-12 ${s.color} rounded-md mx-auto mb-2`}>
                  <s.icon size={22} />
                </div>
                <p className="font-almarai font-extrabold text-2xl text-white">{s.value}</p>
                <p className="font-almarai text-xs text-white/80 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
