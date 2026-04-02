import { useEffect, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Skeleton } from "@/components/ui/skeleton";

type ApiPartner = {
  id: number;
  name: string;
  slug: string;
  logo_path: string | null;
  website_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
};

type PartnersResponse = {
  data?: ApiPartner[];
};

const apiBase = "https://gold-weasel-489740.hostingersite.com";

const toAssetUrl = (path?: string | null) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${apiBase}/storage/${path.replace(/^\/+/, "")}`;
};

export function PartnersSection() {
  const ref = useScrollAnimation();
  const [partners, setPartners] = useState<ApiPartner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadPartners = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${apiBase}/api/partners?page=1`);
        if (!response.ok) {
          throw new Error("Failed to fetch partners");
        }

        const payload = (await response.json()) as PartnersResponse;

        if (isMounted) {
          setPartners(payload.data ?? []);
        }
      } catch {
        if (isMounted) {
          setPartners([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPartners();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      ref={ref.ref}
      className={`py-24 bg-brand-light transition-all duration-1000 ${ref.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-brand-dark mb-3 font-almarai">
            شركاؤونا
          </h2>
          <p className="text-lg md:text-xl text-brand-gray max-w-2xl mx-auto font-almarai leading-relaxed">
            نتعاون مع جهات داعمة وشركاء تنفيذ لتوسيع الأثر وتحقيق قيمة أكبر
            للمبادرات والمشروعات.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-full max-w-xl rounded-2xl border border-brand-gold/5 p-6">
              <Skeleton className="mx-auto h-24 w-56 rounded-md" />
            </div>
          </div>
        ) : partners.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-8">
            {partners.map((partner) => {
              const logoUrl = toAssetUrl(partner.logo_path);

              return (
                <a
                  key={partner.id}
                  href={partner.website_url || "#"}
                  target={partner.website_url ? "_blank" : undefined}
                  rel={partner.website_url ? "noreferrer" : undefined}
                  aria-label={partner.name}
                  className="w-[110px]"
                >
                  <div className="flex h-20 items-center justify-center rounded-2xl border border-brand-gold/10 bg-white p-3 transition-all hover:-translate-y-1">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={partner.name}
                        className="h-auto w-auto max-h-12 max-w-[84px] object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="font-almarai text-brand-gold-dark text-lg font-bold">
                        {partner.name}
                      </span>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <p className="text-center font-almarai text-lg text-brand-gray">
            لا توجد بيانات شركاء متاحة حاليًا.
          </p>
        )}
      </div>
    </section>
  );
}
