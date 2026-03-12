import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function VideoSection() {
  const ref = useScrollAnimation();

  return (
    <section ref={ref.ref} className={`py-24 bg-white transition-all duration-1000 ${ref.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-brand-dark mb-6">شاهد كيفية عملنا</h2>
          <p className="text-xl text-brand-gray max-w-2xl mx-auto">تعرّف على منهجيتنا وكيف نساعد المنظمات غير الربحية على تحقيق أثر مستدام</p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative w-full pt-[56.25%] bg-brand-dark rounded-[3rem] overflow-hidden shadow-2xl">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://bod.com.sa/wp-content/uploads/2025/01/Website-Bod-New-Version-1.mp4#5340"
              title="Birth of a Dream - Introduction"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
