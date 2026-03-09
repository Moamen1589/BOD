import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  {
    text: "لقد ساعدتنا خدماتهم في تحويل استراتيجياتنا إلى واقع ملموس. فريق عمل محترف واستشاريون ذوي خبرة عالية.",
    label: "شركاء موثوقون في النجاح",
    author: "أ. محمد العتيبي",
    role: "مدير جمعية البر"
  },
  {
    text: "أداء الفريق كان متميزًا، ونتائج المشروع تسير وفق الجداول الزمنية المتفق عليها، مع ضمان أعلى معايير الجودة.",
    label: "احترافية في التنفيذ",
    author: "د. سارة الغامدي",
    role: "مؤسسة مبادرة إثراء"
  },
  {
    text: "تصاميم الفيديوهات والهوية البصرية كانت رائعة، وقد ساعدتنا في تعزيز تواجدنا الرقمي ورفع مستوى الوعي حول مؤسستنا.",
    label: "محتوى مبدع يعكس هويتنا",
    author: "أ. خالد الدوسري",
    role: "رئيس مجلس إدارة جمعية رعاية"
  }
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useScrollAnimation();

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={scrollRef.ref} className={`py-24 bg-brand-light transition-all duration-1000 ${scrollRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} id="testimonials">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="font-almarai text-sm font-bold text-brand-gold-dark bg-brand-gold/15 px-4 py-1.5 rounded-md">
            عملائنا
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-brand-dark mt-6 mb-4 font-almarai">ماذا يقول عملاؤنا</h2>
          <div className="w-24 h-1 bg-brand-gold mx-auto rounded-full"></div>
        </div>

        <div className="relative max-w-4xl mx-auto overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out" 
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          >
            {testimonials.map((item, idx) => (
              <div key={idx} className="w-full flex-shrink-0 px-4">
                <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden relative">
                  <CardContent className="p-8 md:p-12">
                    <Quote className="text-brand-gold/10 w-24 h-24 absolute top-4 right-4 rotate-180" />
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <h4 className="text-2xl font-bold text-brand-dark mb-6 font-almarai">{item.label}</h4>
                      <p className="text-xl md:text-2xl text-brand-dark/80 font-medium mb-10 leading-relaxed italic font-almarai">
                        "{item.text}"
                      </p>
                      <div className="mt-4">
                        <h5 className="text-lg font-bold text-brand-dark font-almarai">{item.author}</h5>
                        <p className="text-brand-gold font-medium font-almarai">{item.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12 gap-6">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prev}
              className="rounded-full border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white w-14 h-14 shadow-lg transition-all"
            >
              <ChevronRight size={28} />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={next}
              className="rounded-full border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white w-14 h-14 shadow-lg transition-all"
            >
              <ChevronLeft size={28} />
            </Button>
          </div>
          
          <div className="flex justify-center mt-8 gap-3">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${activeIndex === idx ? 'bg-brand-gold w-10' : 'bg-brand-gold/20 w-2.5'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
