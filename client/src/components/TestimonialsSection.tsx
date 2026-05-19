import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { blogApiBase } from "@/lib/blogApi";

type TestimonialApiItem = {
  id: number;
  name?: { ar?: string | null; en?: string | null } | null;
  organization?: { ar?: string | null; en?: string | null } | null;
  quote?: { ar?: string | null; en?: string | null } | null;
  rating?: number | null;
  image?: string | null;
};

type TestimonialsApiResponse = {
  testimonials?: TestimonialApiItem[];
  success_stories?: unknown[];
  carousel?: {
    testimonials?: {
      auto_play?: boolean;
      auto_play_speed?: number;
      slides_to_show?: number;
      show_dots?: boolean;
      show_arrows?: boolean;
    };
  };
};

type TestimonialCard = {
  id: number;
  text: string;
  author: string;
  role: string;
  image: string | null;
};

const fallbackTestimonials: TestimonialCard[] = [
  {
    id: 1,
    text: "لقد ساعدتنا خدماتهم في تحويل استراتيجياتنا إلى واقع ملموس. فريق عمل محترف واستشاريون ذوي خبرة عالية.",
    author: "أ. محمد العتيبي",
    role: "مدير جمعية البر",
    image: null,
  },
  {
    id: 2,
    text: "أداء الفريق كان متميزًا، ونتائج المشروع تسير وفق الجداول الزمنية المتفق عليها، مع ضمان أعلى معايير الجودة.",
    author: "د. سارة الغامدي",
    role: "مؤسسة مبادرة إثراء",
    image: null,
  },
  {
    id: 3,
    text: "تصاميم الفيديوهات والهوية البصرية كانت رائعة، وقد ساعدتنا في تعزيز تواجدنا الرقمي ورفع مستوى الوعي حول مؤسستنا.",
    author: "أ. خالد الدوسري",
    role: "رئيس مجلس إدارة جمعية رعاية",
    image: null,
  },
];

const resolveText = (value?: { ar?: string | null; en?: string | null } | null) => {
  if (!value) return null;
  return value.ar?.trim() || value.en?.trim() || null;
};

const resolveTestimonialImage = (value?: string | null) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://lh3.googleusercontent.com/d/${match[1]}=w1000`;
  }
  return `${blogApiBase}/${trimmed.replace(/^\//, "")}`;
};

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<TestimonialCard[]>(fallbackTestimonials);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(5000);
  const scrollRef = useScrollAnimation();

  const next = () =>
    setActiveIndex((prev) => (testimonials.length > 0 ? (prev + 1) % testimonials.length : 0));
  const prev = () =>
    setActiveIndex((prev) =>
      testimonials.length > 0 ? (prev - 1 + testimonials.length) % testimonials.length : 0,
    );

  useEffect(() => {
    let isMounted = true;

    const loadTestimonials = async () => {
      try {
        const res = await fetch(`${blogApiBase}/api/testimonials`);
        if (!res.ok) return;

        const payload = (await res.json()) as TestimonialsApiResponse;
        const mapped = (payload.testimonials ?? []).map<TestimonialCard>((item) => ({
          id: item.id,
          text: resolveText(item.quote) || "",
          author: resolveText(item.name) || "",
          role: resolveText(item.organization) || "",
          image: resolveTestimonialImage(item.image),
        }));

        if (!isMounted) return;

        if (mapped.length > 0) {
          setTestimonials(mapped);
        }

        const speed = payload.carousel?.testimonials?.auto_play_speed;
        if (typeof speed === "number" && speed > 0) {
          setAutoPlaySpeed(speed);
        }
      } catch {
        if (!isMounted) return;
        setTestimonials(fallbackTestimonials);
      }
    };

    loadTestimonials();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;

    const timer = setInterval(next, autoPlaySpeed);
    return () => clearInterval(timer);
  }, [autoPlaySpeed, testimonials.length]);

  useEffect(() => {
    setActiveIndex(0);
  }, [testimonials]);

  return (
    <section ref={scrollRef.ref} className={`py-16 md:py-24 bg-brand-light transition-all duration-1000 ${scrollRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} id="testimonials">
      <div className="container mx-auto px-4 sm:px-6">
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
            {testimonials.map((item) => (
              <div key={item.id} className="w-full flex-shrink-0 px-4">
                <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden relative">
                  <CardContent className="p-8 md:p-12">
                    <Quote className="text-brand-gold/10 w-24 h-24 absolute top-4 right-4 rotate-180" />
                    <div className="relative z-10 flex flex-col items-center text-center">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.author}
                          className="w-20 h-20 rounded-full object-cover mb-5 border-4 border-brand-gold/20 shadow-sm"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      )}
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

          <div className="flex justify-center mt-10 md:mt-12 gap-4 md:gap-6">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prev}
              className="rounded-full border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white w-12 h-12 md:w-14 md:h-14 shadow-lg transition-all"
            >
              <ChevronRight size={28} />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={next}
              className="rounded-full border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white w-12 h-12 md:w-14 md:h-14 shadow-lg transition-all"
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
