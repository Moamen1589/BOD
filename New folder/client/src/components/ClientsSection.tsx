import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const clientLogos = [
  { name: "عميل 1", logo: "https://via.placeholder.com/150x150?text=Client+1" },
  { name: "عميل 2", logo: "https://via.placeholder.com/150x150?text=Client+2" },
  { name: "عميل 3", logo: "https://via.placeholder.com/150x150?text=Client+3" },
  { name: "عميل 4", logo: "https://via.placeholder.com/150x150?text=Client+4" },
  { name: "عميل 5", logo: "https://via.placeholder.com/150x150?text=Client+5" },
  { name: "عميل 6", logo: "https://via.placeholder.com/150x150?text=Client+6" },
  { name: "عميل 7", logo: "https://via.placeholder.com/150x150?text=Client+7" },
  { name: "عميل 8", logo: "https://via.placeholder.com/150x150?text=Client+8" },
];

export function ClientsSection() {
  const ref = useScrollAnimation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerView = 4;
  const totalSlides = Math.ceil(clientLogos.length / itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const visibleLogos = clientLogos.slice(
    currentIndex * itemsPerView,
    (currentIndex + 1) * itemsPerView
  );

  return (
    <section ref={ref.ref} className={`py-24 bg-white transition-all duration-1000 ${ref.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-brand-dark mb-3">عملاؤنا</h2>
            <p className="text-xl text-brand-gray max-w-2xl">نفخر بالعمل مع مئات المنظمات غير الربحية الرائدة</p>
          </div>
          <Button asChild className="mt-6 md:mt-0 bg-brand-dark text-white hover:bg-brand-dark/90 px-10 py-6 rounded-2xl font-bold flex items-center gap-2">
            <Link href="/clients" className="flex items-center gap-2">
              شاهد الكل
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
        </div>

        <div className="relative">
          {/* Carousel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {visibleLogos.map((client, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center p-8 bg-brand-light rounded-2xl border-2 border-brand-gold/10 hover:border-brand-gold/30 transition-all hover:shadow-lg"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-w-full h-24 object-contain"
                />
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <button
                onClick={prevSlide}
                className="p-3 rounded-full bg-brand-gold text-white hover:bg-brand-gold-dark transition-all shadow-lg hover:shadow-xl"
                aria-label="Previous slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 rounded-full bg-brand-gold text-white hover:bg-brand-gold-dark transition-all shadow-lg hover:shadow-xl"
                aria-label="Next slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex gap-2">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentIndex ? "bg-brand-gold w-8" : "bg-brand-gray/30"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
