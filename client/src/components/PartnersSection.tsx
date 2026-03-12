import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import img from "../..//../attached_assets/partenr-img.png";
const partners = [{ name: "شريك 1", logo: "" }];

export function PartnersSection() {
  const ref = useScrollAnimation();

  return (
    <section
      ref={ref.ref}
      className={`py-24 bg-brand-light transition-all duration-1000 ${ref.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-brand-dark mb-3">
            شركاء منفذين للاحتضان الجزئي
          </h2>
          <p className="text-xl text-brand-gray max-w-2xl mx-auto">
            نتعاون مع مؤسسات رائدة لتحقيق أثر مجتمعي أكبر
          </p>
            <h5 className="text-center text-xl mt-5">
            <span className="font-normal">
              شركاء منفذين للاحتضان الجزئي التابع لمؤسسة الملك خالد{" "}
            </span>
          </h5>{" "}
        </div>

        <div className="flex gap-8 items-center justify-center">
        
          {partners.map((partner, idx) => (
            <div
              key={idx}
              className="w-full flex items-center justify-center p-6  rounded-2xl   transition-all hover:-translate-y-1 border border-brand-gold/5"
            >
              <img
                src={img}
                alt={partner.name}
                className="max-w-full h-18 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
